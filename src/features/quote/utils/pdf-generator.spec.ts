import { generateQuotePDF } from './pdf-generator'

// Mock do fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('pdf-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateQuotePDF', () => {
    it('should call API with correct parameters', async () => {
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
      const mockResponse = {
        ok: true,
        blob: jest.fn().mockResolvedValue(mockBlob),
      }

      mockFetch.mockResolvedValue(mockResponse)

      const onProgress = jest.fn()
      const onError = jest.fn()
      const onSuccess = jest.fn()

      await generateQuotePDF({
        documentId: 'test123',
        fileName: 'test.pdf',
        onProgress,
        onError,
        onSuccess,
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `${window.location.origin}/template/test123`,
          fileName: 'test.pdf',
        }),
      })
      expect(onProgress).toHaveBeenCalledWith('Gerando PDF...')
      expect(onProgress).toHaveBeenCalledWith('Finalizando...')
      expect(onSuccess).toHaveBeenCalled()
    })

    it('should handle API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      }

      mockFetch.mockResolvedValue(mockResponse)

      const onProgress = jest.fn()
      const onError = jest.fn()
      const onSuccess = jest.fn()

      await generateQuotePDF({
        documentId: 'test123',
        fileName: 'test.pdf',
        onProgress,
        onError,
        onSuccess,
      })

      expect(onProgress).toHaveBeenCalledWith('Gerando PDF...')
      expect(onError).toHaveBeenCalledWith('Erro ao gerar PDF. Tente novamente.')
      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const onProgress = jest.fn()
      const onError = jest.fn()
      const onSuccess = jest.fn()

      await generateQuotePDF({
        documentId: 'test123',
        fileName: 'test.pdf',
        onProgress,
        onError,
        onSuccess,
      })

      expect(onProgress).toHaveBeenCalledWith('Gerando PDF...')
      expect(onError).toHaveBeenCalledWith('Erro ao gerar PDF. Tente novamente.')
      expect(onSuccess).not.toHaveBeenCalled()
    })
  })
})
