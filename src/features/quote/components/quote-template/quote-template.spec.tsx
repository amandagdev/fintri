import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import QuoteTemplate from './quote-template'

// Mocks
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
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
  shareToWhatsAppFromTemplate: jest.fn(),
  handleButtonState: jest.fn(),
}))

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>

describe('QuoteTemplate', () => {
  const mockQuote = {
    id: '1',
    documentId: 'doc1',
    title: 'Test Quote',
    client: {
      name: 'Test Client',
      email: 'client@test.com',
      phone: '123456789',
    },
    total_value: 1000,
    discount: 100,
    quote_send_date: '2024-01-01',
    quote_validate_date: '2024-01-31',
    status_quote: 'pending',
    description: 'Test description',
    observations: 'Test observations',
    items: [
      {
        id: '1',
        name: 'Item 1',
        description: 'Description 1',
        quantity: 1,
        unit_price: 500,
        total_price: 500,
      },
    ],
  }

  const mockCompany = {
    name: 'Test Company',
    email: 'company@test.com',
    phone: '987654321',
    address: 'Test Address',
    logo: 'logo-url',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseTranslations.mockReturnValue((key: string) => key)
  })

  it('should render quote template with company data', () => {
    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('company@test.com')).toBeInTheDocument()
    expect(screen.getByText('Test Address')).toBeInTheDocument()
  })

  it('should render quote template with client data when company is null', () => {
    render(<QuoteTemplate quote={mockQuote} company={null} />)

    expect(screen.getByText('Test Client')).toBeInTheDocument()
    expect(screen.getByText('client@test.com')).toBeInTheDocument()
  })

  it('should handle download PDF button click', async () => {
    const { generateQuotePDF } = jest.requireMock('../../utils/pdf-generator')
    generateQuotePDF.mockResolvedValue(undefined)

    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    const downloadButton = screen.getByText('pdf.downloadButton')
    fireEvent.click(downloadButton)

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

  it('should handle copy link button click', async () => {
    const { copyToClipboard } = jest.requireMock('../../utils/share-utils')
    copyToClipboard.mockResolvedValue(true)

    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    const copyButton = screen.getByText('copyLink')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(copyToClipboard).toHaveBeenCalledWith(window.location.href)
    })
  })

  it('should handle WhatsApp share button click', () => {
    const { shareToWhatsAppFromTemplate } = jest.requireMock('../../utils/share-utils')

    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    const whatsappButton = screen.getByText('pdf.shareButton')
    fireEvent.click(whatsappButton)

    expect(shareToWhatsAppFromTemplate).toHaveBeenCalledWith('Test Quote')
  })

  it('should display correct status text', () => {
    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    expect(screen.getByText('template.pending')).toBeInTheDocument()
  })

  it('should display quote items section when available', () => {
    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    expect(screen.getByText('template.items')).toBeInTheDocument()
  })

  it('should display quote description and observations', () => {
    render(<QuoteTemplate quote={mockQuote} company={mockCompany} />)

    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Test observations')).toBeInTheDocument()
  })
})
