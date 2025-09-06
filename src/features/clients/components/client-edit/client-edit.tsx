'use client'

import { useActionState } from 'react'

import { updateClientAction } from '../../actions'
import { initialState } from '../../state'
import type { Client } from '../../types'
import { ClientForm } from '../client-form/client-form'

export function EditClientForm({ client }: { client: Client }) {
  const updateActionWithId = updateClientAction.bind(null, client.documentId)

  const [state, formAction] = useActionState(updateActionWithId, initialState)

  return <ClientForm action={formAction} state={state} initialData={client} />
}
