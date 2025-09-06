import type { z } from 'zod'

import type { QuoteSchema } from './validation/schema'

export type Quote = z.infer<typeof QuoteSchema>

export const initialState: { message?: string; errors?: FieldErrors } = {
  message: '',
  errors: {},
}

export type FieldErrors = {
  title?: string[]
  description?: string[]
  status_quote?: string[]
  quote_send_date?: string[]
  quote_validate_date?: string[]
  observations?: string[]
  client?: string[]
  total_value?: string[]
  discount?: string[]
  notification?: string[]
}
