import { clientSchema } from './schema'

describe('Client Schema Validation', () => {
  describe('name field', () => {
    it('validates a valid name with 3 or more characters', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates a valid name with exactly 3 characters', () => {
      const validData = {
        name: 'Ana',
        email: 'ana@exemplo.com',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects a name with less than 3 characters', () => {
      const invalidData = {
        name: 'Jo',
        email: 'jo@exemplo.com',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.fullNameTooShort')
        expect(result.error.issues[0].path).toEqual(['name'])
      }
    })

    it('rejects an empty name', () => {
      const invalidData = {
        name: '',
        email: 'vazio@exemplo.com',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.fullNameTooShort')
        expect(result.error.issues[0].path).toEqual(['name'])
      }
    })
  })

  describe('email field', () => {
    it('validates a valid email address', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates an email with subdomain', () => {
      const validData = {
        name: 'Maria Santos',
        email: 'maria@empresa.com.br',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects an invalid email format', () => {
      const invalidData = {
        name: 'Email Inválido',
        email: 'email-invalido',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.invalidEmail')
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('rejects an email without @ symbol', () => {
      const invalidData = {
        name: 'Sem Arroba',
        email: 'semarroba.com',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.invalidEmail')
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('rejects an email without domain', () => {
      const invalidData = {
        name: 'Sem Domínio',
        email: 'semdominio@',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.invalidEmail')
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })
  })

  describe('optional fields', () => {
    it('validates with all optional fields provided', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11987654321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        documentId: 'client-123',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBe('11987654321')
        expect(result.data.cpf_or_cnpj).toBe('123.456.789-00')
        expect(result.data.address).toBe('Rua das Flores, 123 - São Paulo, SP')
        expect(result.data.documentId).toBe('client-123')
      }
    })

    it('validates with no optional fields provided', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBeUndefined()
        expect(result.data.cpf_or_cnpj).toBeUndefined()
        expect(result.data.address).toBeUndefined()
        expect(result.data.documentId).toBeUndefined()
      }
    })

    it('validates with some optional fields provided', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      }

      const result = clientSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBe('11987654321')
        expect(result.data.cpf_or_cnpj).toBeUndefined()
        expect(result.data.address).toBe('Rua das Flores, 123 - São Paulo, SP')
        expect(result.data.documentId).toBeUndefined()
      }
    })
  })

  describe('complete validation scenarios', () => {
    it('validates a complete client record', () => {
      const completeData = {
        name: 'João Silva',
        email: 'joao.silva@empresa.com.br',
        phone: '+55 (11) 98765-4321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123, Bairro Centro, São Paulo - SP, 01234-567',
        documentId: 'CLIENTE-2024-001',
      }

      const result = clientSchema.safeParse(completeData)
      expect(result.success).toBe(true)
    })

    it('rejects data with multiple validation errors', () => {
      const invalidData = {
        name: 'Jo',
        email: 'email-invalido',
        phone: '11987654321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      }

      const result = clientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2)

        const nameError = result.error.issues.find((issue) => issue.path[0] === 'name')
        const emailError = result.error.issues.find((issue) => issue.path[0] === 'email')

        expect(nameError?.message).toBe('errors.fullNameTooShort')
        expect(emailError?.message).toBe('errors.invalidEmail')
      }
    })
  })
})
