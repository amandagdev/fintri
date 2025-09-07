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

// Helper function to parse form data consistently
function parseClientFormData(formData: FormData) {
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cpf_or_cnpj: formData.get('cpf_or_cnpj'),
    address: formData.get('address'),
  }
}

// Helper function to handle common validation and error response
function handleClientValidation(parsed: { success: boolean; error?: unknown; data?: unknown }) {
  if (!parsed.success) {
    const fieldErrors: State['errors'] = {}
    ;(parsed.error as { issues: Array<{ path: string[]; message: string }> }).issues.forEach(
      (issue) => {
        const field = issue.path[0] as keyof ClientFormData
        fieldErrors[field] = issue.message
      },
    )
    return { errors: fieldErrors }
  }
  return null
}

export async function addClientAction(prevState: State, formData: FormData): Promise<State> {
  const formDataParsed = parseClientFormData(formData)
  const parsed = clientSchema.safeParse(formDataParsed)

  const validationError = handleClientValidation(parsed)
  if (validationError) return validationError

  try {
    if (!parsed.data) {
      return { message: 'failedToProcessClientData' }
    }
    await createClient({ data: parsed.data })
    revalidatePath('/clients')
    return { success: true, message: 'clientCreatedSuccessfully' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}

export async function updateClientAction(
  clientDocumentId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const formDataParsed = parseClientFormData(formData)
  const parsed = clientSchema.safeParse(formDataParsed)

  const validationError = handleClientValidation(parsed)
  if (validationError) return validationError

  try {
    if (!parsed.data) {
      return { message: 'failedToProcessClientData' }
    }
    await updateClient(clientDocumentId, { data: parsed.data })
    revalidatePath('/clients')
    redirect('/clients?updated=true')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}

export async function deleteClientAction(documentId: string) {
  if (!documentId) return { success: false, message: 'missingId' }

  try {
    await deleteClient(documentId)
    revalidatePath('/clients')
    return { success: true, message: 'clientDeletedSuccessfully' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'deleteFailed'
    return { success: false, message }
  }
}
