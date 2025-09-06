'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  }
}

function handleQuoteValidation(parsed: { success: boolean; error?: unknown; data?: unknown }) {
  if (!parsed.success) {
    const errors = (parsed.error as { flatten: () => { fieldErrors: FieldErrors } }).flatten()
      .fieldErrors
    return { errors, message: 'errors.failedToProcessQuoteData' }
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
      return { message: 'errors.failedToProcessQuoteData' }
    }
    await addQuote({ data: parsed.data })
    revalidatePath('/quotes')
    return { message: 'errors.quoteCreatedSuccessfully' }
  } catch (error: unknown) {
    return { message: (error as Error).message }
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
      return { message: 'errors.failedToProcessQuoteData' }
    }
    await updateQuote(quoteDocumentId, { data: parsed.data })
    revalidatePath('/quotes')
    return { message: 'errors.quoteUpdatedSuccessfully' }
  } catch (error: unknown) {
    return { message: (error as Error).message }
  }
}

export async function deleteQuoteAction(documentId: string) {
  try {
    await deleteQuote(documentId)
    revalidatePath('/quotes')
    redirect('/quotes?deleted=true')
  } catch (error: unknown) {
    throw error
  }
}
