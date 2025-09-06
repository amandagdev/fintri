import { mapClientErrorToKey, mapQuoteErrorToKey } from './strapi-error-map'

describe('Strapi Error Mapping', () => {
  describe('mapClientErrorToKey', () => {
    it('should return default error when message is undefined', () => {
      expect(mapClientErrorToKey(undefined)).toBe('errors.clientUpdateFailed')
    })

    it('should return default error when message is empty', () => {
      expect(mapClientErrorToKey('')).toBe('errors.clientUpdateFailed')
    })

    it('should map known error messages correctly', () => {
      expect(mapClientErrorToKey('This attribute must be unique')).toBe('errors.emailTaken')
      expect(mapClientErrorToKey('Not Found')).toBe('errors.clientNotFound')
      expect(mapClientErrorToKey('Invalid key id')).toBe('errors.invalidKeyId')
      expect(mapClientErrorToKey('Forbidden')).toBe('errors.unauthorized')
      expect(mapClientErrorToKey('Unauthorized')).toBe('errors.unauthorized')
      expect(mapClientErrorToKey('ValidationError')).toBe('errors.validationError')
      expect(mapClientErrorToKey('Bad Request')).toBe('errors.badRequest')
    })

    it('should return detailed error for unknown messages', () => {
      const unknownMessage = 'Some unknown error'
      expect(mapClientErrorToKey(unknownMessage)).toBe(
        `errors.clientUpdateFailed: ${unknownMessage}`,
      )
    })

    it('should handle case-sensitive messages', () => {
      expect(mapClientErrorToKey('not found')).toBe('errors.clientUpdateFailed: not found')
      expect(mapClientErrorToKey('FORBIDDEN')).toBe('errors.clientUpdateFailed: FORBIDDEN')
    })

    it('should handle messages with extra whitespace', () => {
      expect(mapClientErrorToKey(' Not Found ')).toBe('errors.clientUpdateFailed:  Not Found ')
    })
  })

  describe('mapQuoteErrorToKey', () => {
    it('should return default error when message is undefined', () => {
      expect(mapQuoteErrorToKey(undefined)).toBe('errors.quoteUpdateFailed')
    })

    it('should return default error when message is empty', () => {
      expect(mapQuoteErrorToKey('')).toBe('errors.quoteUpdateFailed')
    })

    it('should map known error messages correctly', () => {
      expect(mapQuoteErrorToKey('This attribute must be unique')).toBe('errors.nameAlreadyTaken')
      expect(mapQuoteErrorToKey('Not Found')).toBe('errors.quoteNotFound')
      expect(mapQuoteErrorToKey('Invalid key id')).toBe('errors.invalidKeyId')
      expect(mapQuoteErrorToKey('Forbidden')).toBe('errors.unauthorized')
      expect(mapQuoteErrorToKey('Unauthorized')).toBe('errors.unauthorized')
      expect(mapQuoteErrorToKey('ValidationError')).toBe('errors.validationError')
      expect(mapQuoteErrorToKey('Bad Request')).toBe('errors.badRequest')
    })

    it('should return detailed error for unknown messages', () => {
      const unknownMessage = 'Some unknown quote error'
      expect(mapQuoteErrorToKey(unknownMessage)).toBe(`errors.quoteUpdateFailed: ${unknownMessage}`)
    })

    it('should handle case-sensitive messages', () => {
      expect(mapQuoteErrorToKey('not found')).toBe('errors.quoteUpdateFailed: not found')
      expect(mapQuoteErrorToKey('FORBIDDEN')).toBe('errors.quoteUpdateFailed: FORBIDDEN')
    })

    it('should handle messages with extra whitespace', () => {
      expect(mapQuoteErrorToKey(' Not Found ')).toBe('errors.quoteUpdateFailed:  Not Found ')
    })

    it('should handle special characters in error messages', () => {
      const specialMessage = 'Error with special chars: @#$%^&*()'
      expect(mapQuoteErrorToKey(specialMessage)).toBe(`errors.quoteUpdateFailed: ${specialMessage}`)
    })
  })

  describe('error message variations', () => {
    it('should handle different variations of the same error', () => {
      // Teste para variações de "Not Found"
      expect(mapClientErrorToKey('Not Found')).toBe('errors.clientNotFound')
      expect(mapQuoteErrorToKey('Not Found')).toBe('errors.quoteNotFound')

      // Teste para variações de "Forbidden"
      expect(mapClientErrorToKey('Forbidden')).toBe('errors.unauthorized')
      expect(mapQuoteErrorToKey('Forbidden')).toBe('errors.unauthorized')
    })

    it('should handle error messages with additional context', () => {
      const messageWithContext = 'Not Found: Resource with id 123 does not exist'
      expect(mapClientErrorToKey(messageWithContext)).toBe(
        `errors.clientUpdateFailed: ${messageWithContext}`,
      )
      expect(mapQuoteErrorToKey(messageWithContext)).toBe(
        `errors.quoteUpdateFailed: ${messageWithContext}`,
      )
    })

    it('should handle error messages with JSON content', () => {
      const jsonMessage = '{"error": "Not Found", "details": {"id": 123}}'
      expect(mapClientErrorToKey(jsonMessage)).toBe(`errors.clientUpdateFailed: ${jsonMessage}`)
      expect(mapQuoteErrorToKey(jsonMessage)).toBe(`errors.quoteUpdateFailed: ${jsonMessage}`)
    })
  })

  describe('edge cases', () => {
    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(1000)
      expect(mapClientErrorToKey(longMessage)).toBe(`errors.clientUpdateFailed: ${longMessage}`)
      expect(mapQuoteErrorToKey(longMessage)).toBe(`errors.quoteUpdateFailed: ${longMessage}`)
    })

    it('should handle error messages with newlines', () => {
      const multilineMessage = 'Error:\nLine 1\nLine 2'
      expect(mapClientErrorToKey(multilineMessage)).toBe(
        `errors.clientUpdateFailed: ${multilineMessage}`,
      )
      expect(mapQuoteErrorToKey(multilineMessage)).toBe(
        `errors.quoteUpdateFailed: ${multilineMessage}`,
      )
    })

    it('should handle error messages with unicode characters', () => {
      const unicodeMessage = 'Erro com acentos: ção, ão, ões'
      expect(mapClientErrorToKey(unicodeMessage)).toBe(
        `errors.clientUpdateFailed: ${unicodeMessage}`,
      )
      expect(mapQuoteErrorToKey(unicodeMessage)).toBe(`errors.quoteUpdateFailed: ${unicodeMessage}`)
    })
  })
})
