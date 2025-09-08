import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

// Mocks
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/pt/quote'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../utils/pdf-generator', () => ({
  generateQuotePDF: jest.fn(),
}))

jest.mock('../../utils/share-utils', () => ({
  copyToClipboard: jest.fn(),
  shareToWhatsApp: jest.fn(),
  handleButtonState: jest.fn(),
}))

// Import after mocks
import { QuoteList } from './quote-list'

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('QuoteList', () => {
  const mockQuotes = [
    {
      id: '1',
      documentId: 'doc1',
      title: 'Test Quote 1',
      client: { name: 'Client 1' },
      total_value: 1000,
      discount: 100,
      quote_send_date: '2024-01-01',
      status_quote: 'pending',
    },
    {
      id: '2',
      documentId: 'doc2',
      title: 'Test Quote 2',
      client: { name: 'Client 2' },
      total_value: 2000,
      discount: 0,
      quote_send_date: null,
      status_quote: 'accepted',
    },
  ]

  const mockPush = jest.fn()
  const mockReplace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as ReturnType<typeof useRouter>)
  })

  it('should render quotes table with correct data', () => {
    render(<QuoteList quotes={mockQuotes} />)

    expect(screen.getByText('Test Quote 1')).toBeInTheDocument()
    expect(screen.getByText('Test Quote 2')).toBeInTheDocument()
    expect(screen.getByText('Client 1')).toBeInTheDocument()
    expect(screen.getByText('Client 2')).toBeInTheDocument()
  })

  it('should render empty state when no quotes', () => {
    render(<QuoteList quotes={[]} />)

    expect(screen.getByText('emptyStateTitle')).toBeInTheDocument()
    expect(screen.getByText('emptyStateDescription')).toBeInTheDocument()
  })

  it('should handle edit button click', () => {
    render(<QuoteList quotes={mockQuotes} />)

    const editButtons = screen.getAllByLabelText('editButton')
    fireEvent.click(editButtons[0])

    expect(mockPush).toHaveBeenCalledWith('/pt/quote/edit/doc1')
  })

  it('should handle copy link button click', async () => {
    const { copyToClipboard } = jest.requireMock('../../utils/share-utils')
    copyToClipboard.mockResolvedValue(true)

    render(<QuoteList quotes={mockQuotes} />)

    const copyButtons = screen.getAllByLabelText('copyLink')
    fireEvent.click(copyButtons[0])

    await waitFor(() => {
      expect(copyToClipboard).toHaveBeenCalledWith('http://localhost:3000/template/doc1')
    })
  })

  it('should handle WhatsApp button click', () => {
    const { shareToWhatsApp } = jest.requireMock('../../utils/share-utils')

    render(<QuoteList quotes={mockQuotes} />)

    const whatsappButtons = screen.getAllByLabelText('Enviar WhatsApp')
    fireEvent.click(whatsappButtons[0])

    expect(shareToWhatsApp).toHaveBeenCalledWith('Test Quote 1', 'doc1')
  })

  it('should handle download PDF button click', async () => {
    const { generateQuotePDF } = jest.requireMock('../../utils/pdf-generator')
    generateQuotePDF.mockResolvedValue(undefined)

    render(<QuoteList quotes={mockQuotes} />)

    const downloadButtons = screen.getAllByLabelText('downloadPDF')
    fireEvent.click(downloadButtons[0])

    await waitFor(() => {
      expect(generateQuotePDF).toHaveBeenCalledWith({
        documentId: 'doc1',
        fileName: 'orcamento-doc1.pdf',
        onProgress: expect.any(Function),
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      })
    })
  })
})
