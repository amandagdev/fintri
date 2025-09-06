import { formatCurrency, formatDate, formatDateTime, formatNumber } from './utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00')
      expect(formatCurrency(1500.5)).toBe('R$ 1.500,50')
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 1.000,00')
      expect(formatCurrency(-1500.5)).toBe('-R$ 1.500,50')
    })

    it('should handle decimal places correctly', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
      expect(formatCurrency(999.99)).toBe('R$ 999,99')
      expect(formatCurrency(1000.1)).toBe('R$ 1.000,10')
    })

    it('should handle large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00')
      expect(formatCurrency(1234567.89)).toBe('R$ 1.234.567,89')
    })

    it('should handle null and undefined values', () => {
      expect(formatCurrency(null)).toBe('R$ 0,00')
      expect(formatCurrency(undefined)).toBe('R$ 0,00')
    })

    it('should handle string numbers', () => {
      expect(formatCurrency('1000')).toBe('R$ 1.000,00')
      expect(formatCurrency('1500.50')).toBe('R$ 1.500,50')
    })
  })

  describe('formatDate', () => {
    it('should format valid date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024')
      expect(formatDate('2024-12-31')).toBe('31/12/2024')
      expect(formatDate('2024-02-29')).toBe('29/02/2024') // Ano bissexto
    })

    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('15/01/2024')
    })

    it('should handle null and undefined values', () => {
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('should handle invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('-')
      expect(formatDate('')).toBe('-')
    })

    it('should handle different date formats', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('15/01/2024')
      expect(formatDate('2024-01-15T10:30:00.000Z')).toBe('15/01/2024')
    })
  })

  describe('formatDateTime', () => {
    it('should format valid date strings with time correctly', () => {
      expect(formatDateTime('2024-01-15T10:30:00Z')).toBe('15/01/2024 às 10:30')
      expect(formatDateTime('2024-12-31T23:59:59Z')).toBe('31/12/2024 às 23:59')
    })

    it('should format Date objects with time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      expect(formatDateTime(date)).toBe('15/01/2024 às 10:30')
    })

    it('should handle null and undefined values', () => {
      expect(formatDateTime(null)).toBe('-')
      expect(formatDateTime(undefined)).toBe('-')
    })

    it('should handle invalid date strings', () => {
      expect(formatDateTime('invalid-date')).toBe('-')
      expect(formatDateTime('')).toBe('-')
    })

    it('should handle different time formats', () => {
      expect(formatDateTime('2024-01-15T10:30:00.000Z')).toBe('15/01/2024 às 10:30')
      expect(formatDateTime('2024-01-15T00:00:00Z')).toBe('15/01/2024 às 00:00')
    })
  })

  describe('formatNumber', () => {
    it('should format positive numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1.000')
      expect(formatNumber(1500.5)).toBe('1.500,5')
      expect(formatNumber(0)).toBe('0')
    })

    it('should format negative numbers correctly', () => {
      expect(formatNumber(-1000)).toBe('-1.000')
      expect(formatNumber(-1500.5)).toBe('-1.500,5')
    })

    it('should handle decimal places correctly', () => {
      expect(formatNumber(1234.56)).toBe('1.234,56')
      expect(formatNumber(999.99)).toBe('999,99')
      expect(formatNumber(1000.1)).toBe('1.000,1')
    })

    it('should handle large numbers correctly', () => {
      expect(formatNumber(1000000)).toBe('1.000.000')
      expect(formatNumber(1234567.89)).toBe('1.234.567,89')
    })

    it('should handle null and undefined values', () => {
      expect(formatNumber(null)).toBe('0')
      expect(formatNumber(undefined)).toBe('0')
    })

    it('should handle string numbers', () => {
      expect(formatNumber('1000')).toBe('1.000')
      expect(formatNumber('1500.5')).toBe('1.500,5')
    })

    it('should handle zero correctly', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(0.0)).toBe('0')
      expect(formatNumber('0')).toBe('0')
    })
  })

  describe('edge cases', () => {
    it('should handle very small decimal numbers', () => {
      expect(formatCurrency(0.01)).toBe('R$ 0,01')
      expect(formatNumber(0.01)).toBe('0,01')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('R$ 999.999.999,99')
      expect(formatNumber(999999999.99)).toBe('999.999.999,99')
    })

    it('should handle scientific notation', () => {
      expect(formatCurrency(1e6)).toBe('R$ 1.000.000,00')
      expect(formatNumber(1e6)).toBe('1.000.000')
    })
  })
})
