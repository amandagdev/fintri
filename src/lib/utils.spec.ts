import {
  formatCNPJ,
  formatCPF,
  formatCPForCNPJ,
  formatPhone,
  unformatCNPJ,
  unformatCPF,
  unformatCPForCNPJ,
  unformatPhone,
} from './utils'

describe('Utils - Formatting Functions', () => {
  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01')
      expect(formatCPF('1234567890')).toBe('1234567890')
      expect(formatCPF('123456789')).toBe('123456789')
    })

    it('should handle already formatted CPF', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
    })

    it('should handle empty string', () => {
      expect(formatCPF('')).toBe('')
    })
  })

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95')
      expect(formatCNPJ('1234567800019')).toBe('1234567800019')
      expect(formatCNPJ('123456780001')).toBe('123456780001')
    })

    it('should handle already formatted CNPJ', () => {
      expect(formatCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95')
    })

    it('should handle empty string', () => {
      expect(formatCNPJ('')).toBe('')
    })
  })

  describe('formatPhone', () => {
    it('should format 11-digit phone correctly', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
      expect(formatPhone('1199999999')).toBe('(11) 9999-9999')
    })

    it('should format 10-digit phone correctly', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
    })

    it('should handle already formatted phone', () => {
      expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999')
    })

    it('should handle empty string', () => {
      expect(formatPhone('')).toBe('')
    })
  })

  describe('formatCPForCNPJ', () => {
    it('should format CPF when 11 digits or less', () => {
      expect(formatCPForCNPJ('12345678901')).toBe('123.456.789-01')
      expect(formatCPForCNPJ('1234567890')).toBe('1234567890')
    })

    it('should format CNPJ when more than 11 digits', () => {
      expect(formatCPForCNPJ('12345678000195')).toBe('12.345.678/0001-95')
    })

    it('should handle empty string', () => {
      expect(formatCPForCNPJ('')).toBe('')
    })
  })

  describe('unformat functions', () => {
    it('should unformat CPF correctly', () => {
      expect(unformatCPF('123.456.789-01')).toBe('12345678901')
      expect(unformatCPF('12345678901')).toBe('12345678901')
    })

    it('should unformat CNPJ correctly', () => {
      expect(unformatCNPJ('12.345.678/0001-95')).toBe('12345678000195')
      expect(unformatCNPJ('12345678000195')).toBe('12345678000195')
    })

    it('should unformat phone correctly', () => {
      expect(unformatPhone('(11) 99999-9999')).toBe('11999999999')
      expect(unformatPhone('11999999999')).toBe('11999999999')
    })

    it('should unformat CPF or CNPJ correctly', () => {
      expect(unformatCPForCNPJ('123.456.789-01')).toBe('12345678901')
      expect(unformatCPForCNPJ('12.345.678/0001-95')).toBe('12345678000195')
    })
  })
})
