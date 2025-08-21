import { useTransition } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'

import { DeleteButton } from './button-delete'
import { deleteClientAction } from '../../actions'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../actions', () => ({
  __esModule: true,
  deleteClientAction: jest.fn(),
}))

jest.mock('lucide-react', () => ({
  Trash2: jest.fn(() => <svg data-testid="trash-icon" />),
}))

describe('DeleteButton', () => {
  const mockClientId = 'client-123'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTransition as jest.Mock).mockReturnValue([false, jest.fn()])
  })

  it('should render the delete button with the Trash2 icon', () => {
    render(<DeleteButton clientId={mockClientId} />)
    expect(screen.getByLabelText('deleteButton')).toBeInTheDocument()
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
    expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument()
  })

  it('should show a loading spinner when isPending is true', () => {
    ;(useTransition as jest.Mock).mockReturnValue([true, jest.fn()])
    render(<DeleteButton clientId={mockClientId} />)
    const deleteButton = screen.getByLabelText('deleteButton')
    expect(deleteButton).toBeDisabled()
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('loading loading-xs')
    expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument()
  })

  it('should call deleteClientAction and display success toast on successful deletion', async () => {
    const mockStartTransition = jest.fn((callback) => callback())
    ;(useTransition as jest.Mock).mockReturnValue([false, mockStartTransition])
    ;(deleteClientAction as jest.Mock).mockResolvedValue({
      success: true,
      message: 'deleteSuccessMessage',
    })

    render(<DeleteButton clientId={mockClientId} />)
    fireEvent.click(screen.getByLabelText('deleteButton'))

    await waitFor(() => {
      expect(mockStartTransition).toHaveBeenCalledTimes(1)
      expect(deleteClientAction).toHaveBeenCalledWith(mockClientId)
      expect(toast.success).toHaveBeenCalledWith('deleteSuccessMessage')
      expect(toast.error).not.toHaveBeenCalled()
    })
  })

  it('should call deleteClientAction and display error toast on failed deletion', async () => {
    const mockStartTransition = jest.fn((callback) => callback())
    ;(useTransition as jest.Mock).mockReturnValue([false, mockStartTransition])
    ;(deleteClientAction as jest.Mock).mockResolvedValue({
      success: false,
      message: 'deleteFailed',
    })

    render(<DeleteButton clientId={mockClientId} />)
    fireEvent.click(screen.getByLabelText('deleteButton'))

    await waitFor(() => {
      expect(mockStartTransition).toHaveBeenCalledTimes(1)
      expect(deleteClientAction).toHaveBeenCalledWith(mockClientId)
      expect(toast.error).toHaveBeenCalledWith('deleteFailed')
      expect(toast.success).not.toHaveBeenCalled()
    })
  })
})
