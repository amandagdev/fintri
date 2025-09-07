'use server'

import { revalidatePath } from 'next/cache'

import { addQuote, deleteQuote, updateQuote } from '@/features/quote/services/service'
import type { FieldErrors } from '@/features/quote/state'
import { QuoteSchema } from '@/features/quote/validation/schema'

export interface State {
  errors?: FieldErrors
  message?: string
}

function parseQuoteFormData(formData: FormData) {
  const clientJson = formData.get('client') as string
  const client = clientJson ? JSON.parse(clientJson) : undefined

  const notificationJson = formData.get('notification') as string
  const notification = notificationJson ? JSON.parse(notificationJson) : undefined

  const itemsJson = formData.get('items') as string
  const items = itemsJson ? JSON.parse(itemsJson) : undefined

  const totalValueStr = formData.get('total_value') as string
  const discountStr = formData.get('discount') as string

  return {
    title: formData.get('title'),
    description: formData.get('description'),
    quote_send_date: formData.get('quote_send_date'),
    quote_validate_date: formData.get('quote_validate_date'),
    observations: formData.get('observations'),
    client: client,
    total_value: totalValueStr ? parseFloat(totalValueStr) : 0,
    discount: discountStr ? parseFloat(discountStr) : undefined,
    notification: notification,
    quote_type: formData.get('quote_type') as 'simple' | 'detailed' | null,
    items: items,
  }
}

function handleQuoteValidation(parsed: { success: boolean; error?: unknown; data?: unknown }) {
  if (!parsed.success) {
    const errors = (parsed.error as { flatten: () => { fieldErrors: FieldErrors } }).flatten()
      .fieldErrors
    return { errors, message: 'errors.validationError' }
  }
  return null
}

export async function addQuoteAction(prevState: State, formData: FormData) {
  const formDataParsed = parseQuoteFormData(formData)
  const parsed = QuoteSchema.safeParse(formDataParsed)

  const validationError = handleQuoteValidation(parsed)
  if (validationError) return validationError

  try {
    if (!parsed.data) {
      return { message: 'errors.validationError' }
    }
    await addQuote({ data: { ...parsed.data, title: parsed.data.title || 'Orçamento' } })
    revalidatePath('/quotes')
    return { message: 'errors.quoteCreatedSuccessfully' }
  } catch (error: unknown) {
    console.error('Erro ao criar orçamento:', error)
    return { message: 'errors.unexpectedError' }
  }
}

export async function updateQuoteAction(
  quoteDocumentId: string,
  prevState: State,
  formData: FormData,
) {
  const formDataParsed = parseQuoteFormData(formData)
  const parsed = QuoteSchema.safeParse(formDataParsed)

  const validationError = handleQuoteValidation(parsed)
  if (validationError) return validationError

  try {
    if (!parsed.data) {
      return { message: 'errors.validationError' }
    }
    await updateQuote(quoteDocumentId, {
      data: { ...parsed.data, title: parsed.data.title || 'Orçamento' },
    })
    revalidatePath('/quotes')
    return { message: 'errors.quoteUpdatedSuccessfully' }
  } catch (error: unknown) {
    console.error('Erro ao atualizar orçamento:', error)
    return { message: 'errors.unexpectedError' }
  }
}

export async function deleteQuoteAction(documentId: string) {
  try {
    await deleteQuote(documentId)
    revalidatePath('/quote')
    return { message: 'errors.quoteDeletedSuccessfully' }
  } catch (error: unknown) {
    console.error('Erro ao excluir orçamento:', error)
    return { message: 'errors.unexpectedError' }
  }
}
