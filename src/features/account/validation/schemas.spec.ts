import { describe, expect, it } from '@jest/globals'

import { CompanyDataSchema, PasswordSchema, PersonalDataSchema } from './schemas'

describe('Account Validation Schemas', () => {
  describe('PersonalDataSchema', () => {
    it('should validate valid personal data', () => {
      const validData = {
        fullName: 'João Silva',
        phone: '11999999999',
        cpf: '12345678901',
      }

      const result = PersonalDataSchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate data with empty optional fields', () => {
      const dataWithEmptyFields = {
        fullName: 'João Silva',
        phone: '',
        cpf: '',
      }

      const result = PersonalDataSchema.safeParse(dataWithEmptyFields)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(dataWithEmptyFields)
      }
    })

    it('should reject data with short full name', () => {
      const invalidData = {
        fullName: 'Jo', // Too short
        phone: '11999999999',
        cpf: '12345678901',
      }

      const result = PersonalDataSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['fullName'])
      }
    })

    it('should accept data without email field', () => {
      const dataWithoutEmail = {
        fullName: 'João Silva',
        phone: '11999999999',
        cpf: '12345678901',
      }

      const result = PersonalDataSchema.safeParse(dataWithoutEmail)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(dataWithoutEmail)
      }
    })
  })

  describe('CompanyDataSchema', () => {
    it('should validate valid company data', () => {
      const validData = {
        company: {
          name: 'Empresa Teste',
          cnpj: '12345678000195',
          address: 'Rua Teste, 123',
          email: 'empresa@test.com',
          phone: '11999999999',
          logo: 'logo-url',
        },
      }

      const result = CompanyDataSchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate data with empty optional fields', () => {
      const dataWithEmptyFields = {
        company: {
          name: 'Empresa Teste',
          cnpj: '',
          address: '',
          email: 'valid@email.com',
          phone: '',
          logo: '',
        },
      }

      const result = CompanyDataSchema.safeParse(dataWithEmptyFields)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(dataWithEmptyFields)
      }
    })

    it('should accept data with empty company name (optional field)', () => {
      const dataWithEmptyName = {
        company: {
          name: '',
          cnpj: '12345678000195',
          address: 'Rua Teste, 123',
          email: 'empresa@test.com',
          phone: '11999999999',
        },
      }

      const result = CompanyDataSchema.safeParse(dataWithEmptyName)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(dataWithEmptyName)
      }
    })

    it('should accept data with empty email', () => {
      const dataWithEmptyEmail = {
        company: {
          name: 'Empresa Teste',
          cnpj: '12345678000195',
          address: 'Rua Teste, 123',
          email: '',
          phone: '11999999999',
        },
      }

      const result = CompanyDataSchema.safeParse(dataWithEmptyEmail)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(dataWithEmptyEmail)
      }
    })

    it('should reject data with invalid email', () => {
      const invalidData = {
        company: {
          name: 'Empresa Teste',
          cnpj: '12345678000195',
          address: 'Rua Teste, 123',
          email: 'invalid-email',
          phone: '11999999999',
        },
      }

      const result = CompanyDataSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['company', 'email'])
      }
    })
  })

  describe('PasswordSchema', () => {
    it('should validate valid password data', () => {
      const validData = {
        currentPassword: 'oldPassword123',
        password: 'newPassword123',
        passwordConfirmation: 'newPassword123',
      }

      const result = PasswordSchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject data with short password', () => {
      const invalidData = {
        currentPassword: 'oldPassword123',
        password: '123', // Too short
        passwordConfirmation: '123',
      }

      const result = PasswordSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['password'])
      }
    })

    it('should reject data with password mismatch', () => {
      const invalidData = {
        currentPassword: 'oldPassword123',
        password: 'newPassword123',
        passwordConfirmation: 'differentPassword',
      }

      const result = PasswordSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['passwordConfirmation'])
      }
    })

    it('should reject data with empty current password', () => {
      const invalidData = {
        currentPassword: '', // Required field empty
        password: 'newPassword123',
        passwordConfirmation: 'newPassword123',
      }

      const result = PasswordSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['currentPassword'])
      }
    })
  })
})
