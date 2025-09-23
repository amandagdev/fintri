'use client'

import { useActionState } from 'react'

import { updateClientAction } from '../../actions'
import { useClientForm } from '../../hooks/use-client-form'
import { useClientToast } from '../../hooks/use-client-toast'
import { initialState } from '../../state'
import type { Client } from '../../types'
import { ClientForm } from '../client-form/client-form'

export function EditClientForm({ client }: { client: Client }) {
  const updateActionWithId = updateClientAction.bind(null, client.documentId)
  const [state, formAction] = useActionState(updateActionWithId, initialState)
  const { handleSuccess } = useClientForm()

  useClientToast({ message: state.message, onSuccess: handleSuccess })

  return <ClientForm action={formAction} state={state} initialData={client} />
}
