import { copyToClipboard, shareToWhatsApp, shareToWhatsAppFromTemplate } from './share-utils'

// Mock do window
const mockWindowOpen = jest.fn()
const mockClipboardWriteText = jest.fn()

Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
})

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockClipboardWriteText,
  },
  writable: true,
})

describe('share-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('shareToWhatsApp', () => {
    it('should generate correct WhatsApp URL with message and document ID', () => {
      const title = 'Test Quote'
      const documentId = 'test123'

      shareToWhatsApp(title, documentId)

      const expectedMessage = `Olá! Aqui está seu orçamento: ${title}\n\n${window.location.origin}/template/${documentId}`
      const expectedUrl = `https://wa.me/?text=${encodeURIComponent(expectedMessage)}`

      expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, '_blank')
    })
  })

  describe('shareToWhatsAppFromTemplate', () => {
    it('should generate correct WhatsApp URL with current page URL', () => {
      const title = 'Test Quote'

      shareToWhatsAppFromTemplate(title)

      const expectedMessage = `Olá! Aqui está seu orçamento: ${title}\n\n${window.location.href}`
      const expectedUrl = `https://wa.me/?text=${encodeURIComponent(expectedMessage)}`

      expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, '_blank')
    })
  })

  describe('copyToClipboard', () => {
    it('should copy text to clipboard successfully', async () => {
      mockClipboardWriteText.mockResolvedValue(undefined)

      const result = await copyToClipboard('test text')

      expect(mockClipboardWriteText).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })

    it('should return false on clipboard error', async () => {
      mockClipboardWriteText.mockRejectedValue(new Error('Clipboard error'))

      const result = await copyToClipboard('test text')

      expect(result).toBe(false)
    })
  })
})
