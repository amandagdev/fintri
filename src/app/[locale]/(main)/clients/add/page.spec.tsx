import { useActionState } from 'react'

import { render, screen } from '@testing-library/react'

import { initialState } from '@/features/clients/state'

import AddClientPage from './page'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}))

jest.mock('@/features/clients/actions', () => ({
  addClientAction: jest.fn(),
}))

describe('AddClientPage', () => {
  const mockFormAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useActionState as jest.Mock).mockReturnValue([initialState, mockFormAction])
  })

  it('should render the page with correct title and description', () => {
    render(<AddClientPage />)

    expect(screen.getByText('addPageTitle')).toBeInTheDocument()
    expect(screen.getByText('addPageDescription')).toBeInTheDocument()
  })

  it('should render the ClientForm component', () => {
    render(<AddClientPage />)

    expect(screen.getByLabelText('form.fullNameLabel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'form.saveButton' })).toBeInTheDocument()
  })
})
