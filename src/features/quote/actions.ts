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

export async function addQuoteAction(prevState: State, formData: FormData) {
  const clientJson = formData.get('client') as string
  const client = clientJson ? JSON.parse(clientJson) : undefined

  console.log(formData)

  const notificationJson = formData.get('notification') as string
  const notification = notificationJson ? JSON.parse(notificationJson) : undefined

  const parsed = QuoteSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    quote_send_date: formData.get('quote_send_date'),
    quote_validate_date: formData.get('quote_validate_date'),
    observations: formData.get('observations'),
    client: client,
    total_value: parseFloat(formData.get('total_value') as string),
    discount: formData.get('discount') ? parseFloat(formData.get('discount') as string) : undefined,
    notification: notification,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { errors, message: 'Failed to add quote.' }
  }

  try {
    await addQuote({ data: parsed.data })
    revalidatePath('/quotes')
    return { message: 'Quote created successfully!' }
  } catch (error: unknown) {
    return { message: (error as Error).message }
  }
}

export async function updateQuoteAction(prevState: State, formData: FormData) {
  const id = formData.get('id') as string

  const clientJson = formData.get('client') as string
  const client = clientJson ? JSON.parse(clientJson) : undefined

  const notificationJson = formData.get('notification') as string
  const notification = notificationJson ? JSON.parse(notificationJson) : undefined

  const parsed = QuoteSchema.safeParse({
    id: id,
    title: formData.get('title'),
    description: formData.get('description'),
    quote_send_date: formData.get('quote_send_date'),
    quote_validate_date: formData.get('quote_validate_date'),
    observations: formData.get('observations'),
    client: client,
    total_value: parseFloat(formData.get('total_value') as string),
    discount: formData.get('discount') ? parseFloat(formData.get('discount') as string) : undefined,
    notification: notification,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { errors, message: 'Failed to update quote.' }
  }

  try {
    await updateQuote(id, { data: parsed.data })
    revalidatePath('/quotes')
    revalidatePath(`/quotes/edit/${id}`)
    return { message: 'Quote updated successfully!' }
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
    return { message: (error as Error).message }
  }
}
