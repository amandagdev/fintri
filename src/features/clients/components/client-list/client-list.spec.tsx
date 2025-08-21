import { render, screen, waitFor } from '@testing-library/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { ClientList } from './client-list'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

// Mock DeleteButton component
jest.mock('../button-delete/button-delete', () => ({
  DeleteButton: ({ clientId }: { clientId: string }) => (
    <button data-testid="delete-button" data-client-id={clientId}>
      Delete {clientId}
    </button>
  ),
}))

describe('ClientList', () => {
  const mockClients = [
    {
      id: '1',
      documentId: 'client-1',
      name: 'Client One',
      email: 'one@example.com',
      phone: '111-111-1111',
      cpf_or_cnpj: '111.111.111-11',
      address: 'Address One',
    },
    {
      id: '2',
      documentId: 'client-2',
      name: 'Client Two',
      email: 'two@example.com',
      phone: '222-222-2222',
      cpf_or_cnpj: '222.222.222-22',
      address: 'Address Two',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/clients')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('should render the table with client data when clients are provided', () => {
    render(<ClientList clients={mockClients} />)

    expect(screen.getByText('tableHeaderName')).toBeInTheDocument()
    expect(screen.getByText('tableHeaderEmail')).toBeInTheDocument()
    expect(screen.getByText('tableHeaderPhone')).toBeInTheDocument()
    expect(screen.getByText('tableHeaderActions')).toBeInTheDocument()

    expect(screen.getByText('Client One')).toBeInTheDocument()
    expect(screen.getByText('one@example.com')).toBeInTheDocument()
    expect(screen.getByText('111-111-1111')).toBeInTheDocument()
    expect(screen.getAllByLabelText('editButton')[0]).toHaveAttribute(
      'href',
      '/clients/edit/client-1',
    )
    expect(screen.getAllByTestId('delete-button')[0]).toHaveAttribute('data-client-id', 'client-1')

    expect(screen.getByText('Client Two')).toBeInTheDocument()
    expect(screen.getByText('two@example.com')).toBeInTheDocument()
    expect(screen.getByText('222-222-2222')).toBeInTheDocument()
    expect(screen.getAllByLabelText('editButton')[1]).toHaveAttribute(
      'href',
      '/clients/edit/client-2',
    )
  })

  it('should render the empty state message when no clients are provided', () => {
    render(<ClientList clients={[]} />)

    expect(screen.getByText('emptyStateTitle')).toBeInTheDocument()
    expect(screen.getByText('emptyStateDescription')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('should display success toast and replace URL when "success=true" is in search params', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('success=true'))
    const mockReplace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })

    render(<ClientList clients={[]} />)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successMessage')
      expect(mockReplace).toHaveBeenCalledWith('/clients', { scroll: false })
    })
  })

  it('should not display success toast when "success" is not in search params', () => {
    render(<ClientList clients={[]} />)

    expect(toast.success).not.toHaveBeenCalled()
  })

  it('should display update toast and replace URL when "updated=true" is in search params', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('updated=true'))
    const mockReplace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })

    render(<ClientList clients={[]} />)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('updateSuccessMessage')
      expect(mockReplace).toHaveBeenCalledWith('/clients', { scroll: false })
    })
  })
})
