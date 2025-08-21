import { useActionState } from 'react'

import { render, screen } from '@testing-library/react'

import { EditClientForm } from './client-edit'
import { initialState } from '../../state'
import type { Client } from '../../types'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}))

jest.mock('../client-form/client-form', () => ({
  ClientForm: ({
    action,
    state,
    initialData,
  }: {
    action: () => void
    state: unknown
    initialData: Client
  }) => (
    <div data-testid="mock-client-form">
      <div data-testid="form-action">action-present</div>
      <div data-testid="form-state">state-present</div>
      <div data-testid="form-initial-data">{initialData ? initialData.name : 'no-data'}</div>
    </div>
  ),
}))

jest.mock('../../actions', () => ({
  updateClientAction: jest.fn(),
}))

describe('EditClientForm', () => {
  const mockClient: Client = {
    id: 123,
    documentId: 'client-123',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    phone: '11987654321',
    cpf_or_cnpj: '123.456.789-00',
  }

  const mockFormAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useActionState as jest.Mock).mockReturnValue([initialState, mockFormAction])
  })

  it('renders ClientForm component with correct props', () => {
    render(<EditClientForm client={mockClient} />)

    expect(screen.getByTestId('mock-client-form')).toBeInTheDocument()
    expect(screen.getByTestId('form-action')).toHaveTextContent('action-present')
    expect(screen.getByTestId('form-state')).toHaveTextContent('state-present')
    expect(screen.getByTestId('form-initial-data')).toHaveTextContent('João Silva')
  })

  it('calls useActionState with updateClientAction bound to client ID', () => {
    render(<EditClientForm client={mockClient} />)

    expect(useActionState).toHaveBeenCalledWith(expect.any(Function), initialState)
  })

  it('passes client data as initialData to ClientForm', () => {
    render(<EditClientForm client={mockClient} />)

    const initialDataElement = screen.getByTestId('form-initial-data')
    expect(initialDataElement).toHaveTextContent(mockClient.name)
  })

  it('handles different client data correctly', () => {
    const differentClient: Client = {
      id: 456,
      documentId: 'client-456',
      name: 'Maria Santos',
      email: 'maria.santos@exemplo.com',
      phone: '21987654321',
      cpf_or_cnpj: '987.654.321-00',
    }

    render(<EditClientForm client={differentClient} />)

    const initialDataElement = screen.getByTestId('form-initial-data')
    expect(initialDataElement).toHaveTextContent('Maria Santos')
  })
})
