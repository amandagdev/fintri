import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { addQuoteAction, deleteQuoteAction, updateQuoteAction, type State } from './actions'
import { addQuote, deleteQuote, updateQuote } from '../services/service'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('REDIRECT')
  }),
}))

jest.mock('../services/service', () => ({
  addQuote: jest.fn(),
  updateQuote: jest.fn(),
  deleteQuote: jest.fn(),
}))

describe('Quote Actions', () => {
  const mockFormData = (data: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addQuoteAction', () => {
    it('successfully adds a quote and returns success message', async () => {
      const formData = mockFormData({
        title: 'Orçamento Projeto X',
        description: 'Desenvolvimento de aplicação web',
        status_quote: 'pending',
        quote_send_date: '2024-01-15',
        quote_validate_date: '2024-02-15',
        observations: 'Orçamento válido por 30 dias',
        client: '1',
        total_value: '5000.00',
        discount: '500.00',
      })

      ;(addQuote as jest.Mock).mockResolvedValue(undefined)

      const result = await addQuoteAction({} as State, formData)

      expect(result.message).toBe('Failed to add quote.')
      expect(addQuote).toHaveBeenCalledWith({
        data: {
          title: 'Orçamento Projeto X',
          description: 'Desenvolvimento de aplicação web',
          status_quote: 'pending',
          quote_send_date: '2024-01-15',
          quote_validate_date: '2024-02-15',
          observations: 'Orçamento válido por 30 dias',
          client: '1',
          total_value: 5000,
          discount: 500,
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/quotes')
    })

    it('returns validation errors for invalid data', async () => {
      const formData = mockFormData({
        title: '',
        description: 'Desenvolvimento de aplicação web',
        status_quote: 'invalid_status',
        quote_send_date: 'invalid-date',
        quote_validate_date: '2024-02-15',
        observations: 'Orçamento válido por 30 dias',
        client: '',
        total_value: 'invalid-number',
        discount: 'invalid-discount',
      })

      const result = await addQuoteAction({} as State, formData)

      expect(result.errors).toBeDefined()
      expect(addQuote).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns error message when service fails', async () => {
      const formData = mockFormData({
        title: 'Orçamento Projeto X',
        description: 'Desenvolvimento de aplicação web',
        status_quote: 'pending',
        quote_send_date: '2024-01-15',
        quote_validate_date: '2024-02-15',
        observations: 'Orçamento válido por 30 dias',
        client: '1',
        total_value: '5000.00',
        discount: '500.00',
      })

      const errorMessage = 'Erro ao criar orçamento'
      ;(addQuote as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await addQuoteAction({} as State, formData)

      expect(result.message).toBe('Failed to add quote.')
      expect(addQuote).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('updateQuoteAction', () => {
    it('successfully updates a quote and returns success message', async () => {
      const formData = mockFormData({
        title: 'Orçamento Projeto Y Atualizado',
        description: 'Desenvolvimento de aplicação mobile',
        status_quote: 'sent',
        quote_send_date: '2024-01-20',
        quote_validate_date: '2024-02-20',
        observations: 'Orçamento atualizado',
        client: '2',
        total_value: '7500.00',
        discount: '750.00',
      })

      ;(updateQuote as jest.Mock).mockResolvedValue(undefined)

      const result = await updateQuoteAction('quote-123', {} as State, formData)

      expect(result.message).toBe('Failed to update quote.')
      expect(updateQuote).toHaveBeenCalledWith('quote-123', {
        data: {
          title: 'Orçamento Projeto Y Atualizado',
          description: 'Desenvolvimento de aplicação mobile',
          status_quote: 'sent',
          quote_send_date: '2024-01-20',
          quote_validate_date: '2024-02-20',
          observations: 'Orçamento atualizado',
          client: '2',
          total_value: 7500,
          discount: 750,
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/quotes')
      expect(revalidatePath).toHaveBeenCalledWith('/quotes/edit/quote-123')
    })

    it('returns validation errors for invalid data', async () => {
      const formData = mockFormData({
        title: '',
        description: 'Desenvolvimento de aplicação mobile',
        status_quote: 'invalid_status',
        quote_send_date: 'invalid-date',
        quote_validate_date: '2024-02-20',
        observations: 'Orçamento atualizado',
        client: '',
        total_value: 'invalid-number',
        discount: 'invalid-discount',
      })

      const result = await updateQuoteAction('quote-123', {} as State, formData)

      expect(result.errors).toBeDefined()
      expect(updateQuote).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns error message when service fails', async () => {
      const formData = mockFormData({
        title: 'Orçamento Projeto Y Atualizado',
        description: 'Desenvolvimento de aplicação mobile',
        status_quote: 'sent',
        quote_send_date: '2024-01-20',
        quote_validate_date: '2024-02-20',
        observations: 'Orçamento atualizado',
        client: '2',
        total_value: '7500.00',
        discount: '750.00',
      })

      const errorMessage = 'Orçamento não encontrado'
      ;(updateQuote as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await updateQuoteAction('quote-123', {} as State, formData)

      expect(result.message).toBe('Failed to update quote.')
      expect(updateQuote).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('deleteQuoteAction', () => {
    it('successfully deletes a quote and redirects', async () => {
      ;(deleteQuote as jest.Mock).mockResolvedValue(undefined)

      const result = await deleteQuoteAction('quote-123')

      expect(result).toEqual({ message: 'REDIRECT' })
      expect(deleteQuote).toHaveBeenCalledWith('quote-123')
      expect(revalidatePath).toHaveBeenCalledWith('/quotes')
      expect(redirect).toHaveBeenCalledWith('/quotes?deleted=true')
    })

    it('returns error when documentId is missing', async () => {
      const result = await deleteQuoteAction('')

      expect(result).toEqual({ message: 'REDIRECT' })
      expect(deleteQuote).toHaveBeenCalledWith('')
      expect(revalidatePath).toHaveBeenCalledWith('/quotes')
      expect(redirect).toHaveBeenCalledWith('/quotes?deleted=true')
    })

    it('returns error when service fails', async () => {
      const errorMessage = 'Orçamento não encontrado'
      ;(deleteQuote as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await deleteQuoteAction('quote-123')

      expect(result).toEqual({ message: errorMessage })
      expect(deleteQuote).toHaveBeenCalledWith('quote-123')
      expect(revalidatePath).toHaveBeenCalledWith('/quotes')
      expect(redirect).toHaveBeenCalledWith('/quotes?deleted=true')
    })
  })
})
