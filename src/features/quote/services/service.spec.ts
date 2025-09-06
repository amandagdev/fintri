import { AxiosError } from 'axios'
import { cookies } from 'next/headers'

import { addQuote, deleteQuote, getQuoteByDocumentId, getQuotes, updateQuote } from './service'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}

describe('Quote Service', () => {
  const mockCookies = cookies as jest.MockedFunction<typeof cookies>

  beforeEach(() => {
    jest.clearAllMocks()
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'mock-jwt-token' }),
    } as unknown as ReturnType<typeof cookies>)
  })

  describe('getQuotes', () => {
    it('successfully fetches quotes with populated relations', async () => {
      const mockQuotes = [
        {
          id: 1,
          documentId: 'quote-1',
          title: 'Orçamento 1',
          total_value: 1000,
          client: { id: 1, name: 'Cliente 1' },
        },
        {
          id: 2,
          documentId: 'quote-2',
          title: 'Orçamento 2',
          total_value: 2000,
          client: { id: 2, name: 'Cliente 2' },
        },
      ]

      mockAxiosInstance.get.mockResolvedValue({
        data: { data: mockQuotes },
      })

      const result = await getQuotes()

      expect(result).toEqual(mockQuotes)
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/quotes?populate=*', {
        headers: {
          Authorization: 'Bearer mock-jwt-token',
          'Cache-Control': 'no-store',
        },
      })
    })

    it('handles errors when fetching quotes', async () => {
      const error = new AxiosError('Network error')
      mockAxiosInstance.get.mockRejectedValue(error)

      const result = await getQuotes()
      expect(result).toEqual([])
    })
  })

  describe('getQuoteByDocumentId', () => {
    it('successfully fetches a quote by documentId', async () => {
      const mockQuote = {
        id: 1,
        documentId: 'quote-123',
        title: 'Orçamento Teste',
        total_value: 1500,
        client: { id: 1, name: 'Cliente Teste' },
      }

      mockAxiosInstance.get.mockResolvedValue({
        data: { data: [mockQuote] },
      })

      const result = await getQuoteByDocumentId('quote-123')

      expect(result).toEqual(mockQuote)
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/quotes?filters[documentId][$eq]=quote-123&populate=*',
        { headers: { Authorization: 'Bearer mock-jwt-token' } },
      )
    })

    it('returns null when quote is not found', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { data: [] },
      })

      const result = await getQuoteByDocumentId('non-existent')

      expect(result).toBeUndefined()
    })

    it('handles errors when fetching quote by documentId', async () => {
      const error = new AxiosError('Network error')
      mockAxiosInstance.get.mockRejectedValue(error)

      await expect(getQuoteByDocumentId('quote-123')).rejects.toThrow('errors.quoteFetchFailed')
    })
  })

  describe('addQuote', () => {
    it('successfully creates a quote', async () => {
      const quoteData = {
        data: {
          title: 'Novo Orçamento',
          description: 'Descrição do orçamento',
          status_quote: 'pending',
          quote_send_date: '2024-01-15',
          quote_validate_date: '2024-02-15',
          observations: 'Observações',
          client: '1',
          total_value: 2500,
          discount: 250,
        },
      }

      const mockResponse = {
        data: {
          data: {
            id: 1,
            documentId: 'new-quote-123',
            ...quoteData.data,
          },
        },
      }

      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await addQuote(quoteData)

      expect(result).toEqual(mockResponse.data.data)
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/quotes',
        {
          data: {
            ...quoteData.data,
            client: undefined,
            notification: undefined,
          },
        },
        {
          headers: { Authorization: 'Bearer mock-jwt-token' },
        },
      )
    })

    it('handles errors when creating quote', async () => {
      const quoteData = {
        data: {
          title: 'Novo Orçamento',
          total_value: 2500,
        },
      }

      const error = new AxiosError('Validation error', '400', undefined, undefined, {
        data: { error: { message: 'Title is required' } },
      } as unknown as ReturnType<typeof cookies>)
      mockAxiosInstance.post.mockRejectedValue(error)

      await expect(addQuote(quoteData)).rejects.toThrow(
        'errors.quoteUpdateFailed: Title is required',
      )
    })
  })

  describe('updateQuote', () => {
    it('successfully updates a quote', async () => {
      const quoteData = {
        data: {
          title: 'Orçamento Atualizado',
          description: 'Descrição atualizada',
          status_quote: 'sent',
          total_value: 3000,
          discount: 300,
        },
      }

      const mockResponse = {
        data: {
          data: {
            id: 1,
            documentId: 'quote-123',
            ...quoteData.data,
          },
        },
      }

      mockAxiosInstance.put.mockResolvedValue(mockResponse)

      const result = await updateQuote('quote-123', quoteData)

      expect(result).toEqual(mockResponse.data.data)
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/quotes/quote-123', quoteData, {
        headers: { Authorization: 'Bearer mock-jwt-token' },
      })
    })

    it('handles errors when updating quote', async () => {
      const quoteData = {
        data: {
          title: 'Orçamento Atualizado',
          total_value: 3000,
        },
      }

      const error = new AxiosError('Not Found', '404', undefined, undefined, {
        data: { error: { message: 'Not Found' } },
      } as unknown as ReturnType<typeof cookies>)
      mockAxiosInstance.put.mockRejectedValue(error)

      await expect(updateQuote('quote-123', quoteData)).rejects.toThrow('errors.quoteNotFound')
    })
  })

  describe('deleteQuote', () => {
    it('successfully deletes a quote', async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.delete.mockResolvedValue(mockResponse)

      const result = await deleteQuote('quote-123')

      expect(result).toEqual(mockResponse.data)
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/quotes/quote-123', {
        headers: { Authorization: 'Bearer mock-jwt-token' },
      })
    })

    it('handles errors when deleting quote', async () => {
      const error = new AxiosError('Not Found', '404', undefined, undefined, {
        data: { error: { message: 'Not Found' } },
      } as unknown as ReturnType<typeof cookies>)
      mockAxiosInstance.delete.mockRejectedValue(error)

      await expect(deleteQuote('quote-123')).rejects.toThrow('errors.quoteNotFound')
    })
  })
})
