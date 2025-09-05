'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient, deleteClient, updateClient } from './services/service'
import type { ClientFormData } from './types'
import { clientSchema } from './validation/schema'

export type State = {
  errors?: Partial<Record<keyof ClientFormData, string>>
  message?: string
  success?: boolean
}

export async function addClientAction(prevState: State, formData: FormData): Promise<State> {
  console.log('addClientAction called with formData:', Object.fromEntries(formData.entries()))

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cpf_or_cnpj: formData.get('cpf_or_cnpj'),
    address: formData.get('address'),
  }

  console.log('Parsed data:', data)

  const parsed = clientSchema.safeParse(data)

  if (!parsed.success) {
    console.log('Validation failed:', parsed.error.issues)
    const fieldErrors: State['errors'] = {}
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ClientFormData
      fieldErrors[field] = issue.message
    })
    return { errors: fieldErrors }
  }

  try {
    console.log('Creating client with data:', parsed.data)
    await createClient({ data: parsed.data })
    console.log('Client created successfully')
  } catch (error) {
    console.error('Error creating client:', error)
    const errorMessage = error instanceof Error ? error.message : 'errors.default'
    return { message: errorMessage }
  }

  console.log('Client created successfully, returning success state')
  revalidatePath('/clients')
  return { success: true, message: 'success' }
}

export async function updateClientAction(
  clientId: number,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cpf_or_cnpj: formData.get('cpf_or_cnpj'),
    address: formData.get('address'),
    documentId: formData.get('documentId'),
  }

  const parsed = clientSchema.safeParse(data)

  if (!parsed.success) {
    const fieldErrors: State['errors'] = {}
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ClientFormData
      fieldErrors[field] = issue.message
    })
    return { errors: fieldErrors }
  }

  try {
    await updateClient(clientId, { data: parsed.data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'errors.default'
    return { message: errorMessage }
  }

  revalidatePath('/clients')
  if (parsed.data.documentId) {
    revalidatePath(`/clients/edit/${parsed.data.documentId}`)
  }

  redirect('/clients?updated=true')
}

export async function deleteClientAction(documentId: string) {
  if (!documentId) return { success: false, message: 'errors.missingId' }

  try {
    await deleteClient(documentId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'errors.deleteFailed'
    return { success: false, message }
  }

  revalidatePath('/clients')
  return { success: true, message: 'deleteSuccessMessage' }
}
