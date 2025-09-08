import { QuoteSchema } from './schema'

describe('Quote Schema Validation', () => {
  describe('valid data', () => {
    it('validates complete quote data', () => {
      const validQuote = {
        title: 'Orçamento Projeto X',
        description: 'Desenvolvimento de aplicação web',
        status_quote: 'pending',
        quote_send_date: '2024-01-15',
        quote_validate_date: '2024-02-15',
        observations: 'Orçamento válido por 30 dias',
        client: { id: '1', name: 'Cliente Teste' },
        total_value: 5000,
        discount: 500,
      }

      const result = QuoteSchema.safeParse(validQuote)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validQuote)
      }
    })

    it('validates quote data with optional fields', () => {
      const minimalQuote = {
        title: 'Orçamento Simples',
        total_value: 1000,
      }

      const result = QuoteSchema.safeParse(minimalQuote)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Orçamento Simples')
        expect(result.data.total_value).toBe(1000)
        expect(result.data.description).toBeUndefined()
        expect(result.data.discount).toBeUndefined()
      }
    })

    it('transforms client.id from number to string', () => {
      const quoteWithNumericClientId = {
        title: 'Orçamento com ID numérico',
        total_value: 2000,
        client: { id: 123, name: 'Cliente Numérico' },
      }

      const result = QuoteSchema.safeParse(quoteWithNumericClientId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.client.id).toBe('123')
        expect(typeof result.data.client.id).toBe('string')
      }
    })

    it('validates documentId when provided', () => {
      const quoteWithDocumentId = {
        id: 'quote-123',
        documentId: 'doc-456',
        title: 'Orçamento com DocumentId',
        total_value: 3000,
      }

      const result = QuoteSchema.safeParse(quoteWithDocumentId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.documentId).toBe('doc-456')
      }
    })
  })

  describe('invalid data', () => {
    it('fails validation for missing required fields', () => {
      const invalidQuote = {
        description: 'Sem total_value',
      }

      const result = QuoteSchema.safeParse(invalidQuote)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['total_value'])
        expect(result.error.issues[0].message).toBe(
          'Invalid input: expected number, received undefined',
        )
      }
    })

    it('validates client with email field', () => {
      const validQuote = {
        title: 'Orçamento Válido',
        total_value: 1000,
        client: { id: '1', name: 'Cliente', email: 'invalid-email' },
      }

      const result = QuoteSchema.safeParse(validQuote)

      expect(result.success).toBe(true)
    })

    it('validates client with phone and address fields', () => {
      const validQuote = {
        title: 'Orçamento com Cliente Completo',
        total_value: 1000,
        client: {
          id: '1',
          name: 'Cliente',
          email: 'cliente@test.com',
          phone: '11999999999',
          address: 'Rua Teste, 123',
        },
      }

      const result = QuoteSchema.safeParse(validQuote)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.client.phone).toBe('11999999999')
        expect(result.data.client.address).toBe('Rua Teste, 123')
      }
    })

    it('fails validation for negative total_value', () => {
      const invalidQuote = {
        title: 'Orçamento Negativo',
        total_value: -1000,
      }

      const result = QuoteSchema.safeParse(invalidQuote)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['total_value'])
        expect(result.error.issues[0].message).toBe('form.totalValueRequired')
      }
    })

    it('fails validation for negative discount', () => {
      const invalidQuote = {
        title: 'Orçamento com Desconto Negativo',
        total_value: 1000,
        discount: -100,
      }

      const result = QuoteSchema.safeParse(invalidQuote)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['discount'])
        expect(result.error.issues[0].message).toBe('form.discountInvalid')
      }
    })

    it('validates status_quote field', () => {
      const validQuote = {
        title: 'Orçamento com Status',
        total_value: 1000,
        status_quote: 'invalid_status',
      }

      const result = QuoteSchema.safeParse(validQuote)

      expect(result.success).toBe(true)
    })

    it('validates date fields', () => {
      const validQuote = {
        title: 'Orçamento com Data',
        total_value: 1000,
        quote_send_date: 'invalid-date',
      }

      const result = QuoteSchema.safeParse(validQuote)

      expect(result.success).toBe(true)
    })

    it('fails validation for missing client name when client is provided', () => {
      const invalidQuote = {
        title: 'Orçamento sem Nome do Cliente',
        total_value: 1000,
        client: { id: '1' },
      }

      const result = QuoteSchema.safeParse(invalidQuote)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1)
        expect(result.error.issues[0].path).toEqual(['client', 'name'])
        expect(result.error.issues[0].message).toBe(
          'Invalid input: expected string, received undefined',
        )
      }
    })
  })

  describe('edge cases', () => {
    it('handles empty string for optional fields', () => {
      const quoteWithEmptyStrings = {
        title: 'Orçamento com Campos Vazios',
        total_value: 1000,
        description: '',
        observations: '',
        discount: 0,
      }

      const result = QuoteSchema.safeParse(quoteWithEmptyStrings)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).toBe('')
        expect(result.data.observations).toBe('')
        expect(result.data.discount).toBe(0)
      }
    })

    it('handles zero discount', () => {
      const quoteWithZeroDiscount = {
        title: 'Orçamento sem Desconto',
        total_value: 1000,
        discount: 0,
      }

      const result = QuoteSchema.safeParse(quoteWithZeroDiscount)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.discount).toBe(0)
      }
    })

    it('handles undefined optional fields', () => {
      const quoteWithUndefinedFields = {
        title: 'Orçamento com Campos Undefined',
        total_value: 1000,
        description: undefined,
        observations: undefined,
        discount: undefined,
      }

      const result = QuoteSchema.safeParse(quoteWithUndefinedFields)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).toBeUndefined()
        expect(result.data.observations).toBeUndefined()
        expect(result.data.discount).toBeUndefined()
      }
    })
  })
})
