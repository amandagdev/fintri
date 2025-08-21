import { render, screen, waitFor } from '@testing-library/react'
import { notFound } from 'next/navigation'

import { EditClientForm } from '@/features/clients/components/client-edit/client-edit'
import { getClientByDocumentId } from '@/features/clients/services/service'

import EditClientPage from './page'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string, values?: Record<string, string>) => {
      if (key === 'editPageDescription' && values && values.clientName) {
        return `You are editing the details for ${values.clientName}.`
      }
      return key
    }),
  ),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/features/clients/services/service', () => ({
  getClientByDocumentId: jest.fn(),
}))

jest.mock('@/features/clients/components/client-edit/client-edit', () => ({
  EditClientForm: jest.fn(({ client }) => (
    <div data-testid="mock-edit-client-form">{client.name}</div>
  )),
}))

describe('EditClientPage', () => {
  const mockClient = {
    id: '1',
    documentId: 'client-123',
    name: 'Client To Edit',
    email: 'edit@example.com',
    phone: '111-222-3333',
    cpf_or_cnpj: '123.456.789-00',
    address: '123 Edit St',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(notFound as jest.Mock).mockImplementation(() => {
      throw new Error('Not Found')
    })
  })

  it('should render the page with correct title and description when client data is available', async () => {
    ;(getClientByDocumentId as jest.Mock).mockResolvedValue(mockClient)

    render(await EditClientPage({ params: { documentId: mockClient.documentId } }))

    expect(screen.getByText('editPageTitle')).toBeInTheDocument()
    expect(
      screen.getByText(`You are editing the details for ${mockClient.name}.`),
    ).toBeInTheDocument()
  })

  it('should render the EditClientForm component with the fetched client data', async () => {
    ;(getClientByDocumentId as jest.Mock).mockResolvedValue(mockClient)

    render(await EditClientPage({ params: { documentId: mockClient.documentId } }))

    await waitFor(() => {
      console.log('EditClientForm calls:', (EditClientForm as jest.Mock).mock.calls)
      expect(EditClientForm).toHaveBeenCalledTimes(1)
      expect(EditClientForm).toHaveBeenCalledWith(
        {
          client: mockClient,
        },
        undefined,
      )
      expect(screen.getByTestId('mock-edit-client-form')).toBeInTheDocument()
      expect(screen.getByTestId('mock-edit-client-form')).toHaveTextContent(mockClient.name)
    })
  })

  it('should call notFound() when no client data is found', async () => {
    ;(getClientByDocumentId as jest.Mock).mockResolvedValue(null)

    await expect(EditClientPage({ params: { documentId: 'non-existent' } })).rejects.toThrow(
      'Not Found',
    )
    expect(notFound).toHaveBeenCalledTimes(1)
  })
})
