import { render, screen, waitFor } from '@testing-library/react'

import { getClients } from '@/features/clients/services/service'
import type { Client } from '@/features/clients/types'

import ClientsPage from './page'

jest.mock('next/link', () => {
  return ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
})

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => Promise.resolve((key: string) => key)),
}))

jest.mock('@/features/clients/components/client-list/client-list', () => ({
  ClientList: ({ clients }: { clients: Client[] }) => (
    <div data-testid="mock-client-list">
      {clients.map((client) => (
        <div key={client.id} data-testid={`client-${client.id}`}>
          {client.name}
        </div>
      ))}
    </div>
  ),
}))

jest.mock('@/features/clients/services/service', () => ({
  getClients: jest.fn(),
}))

describe('ClientsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the page with title, description, and add new client button', async () => {
    const mockClients: Client[] = [
      { id: 1, documentId: 'client-1', name: 'João Silva', email: 'joao@exemplo.com' },
      { id: 2, documentId: 'client-2', name: 'Maria Santos', email: 'maria@exemplo.com' },
    ]

    ;(getClients as jest.Mock).mockResolvedValue(mockClients)

    render(<ClientsPage />)

    await waitFor(() => {
      expect(screen.getByText('clients.title')).toBeInTheDocument()
      expect(screen.getByText('clients.description')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /addNewClient/i })).toBeInTheDocument()
    })
  })

  it('should render ClientList component with fetched clients', async () => {
    const mockClients: Client[] = [
      { id: 1, documentId: 'client-1', name: 'João Silva', email: 'joao@exemplo.com' },
    ]

    ;(getClients as jest.Mock).mockResolvedValue(mockClients)

    render(<ClientsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-client-list')).toBeInTheDocument()
      expect(screen.getByTestId('client-1')).toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
  })

  it('should render ClientList component with empty state when no clients', async () => {
    ;(getClients as jest.Mock).mockResolvedValue([])

    render(<ClientsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-client-list')).toBeInTheDocument()
    })
  })
})
