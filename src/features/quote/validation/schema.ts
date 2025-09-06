import { z } from 'zod'

export const QuoteSchema = z.object({
  id: z.string().optional(),
  documentId: z.string().optional(),
  title: z.string().min(1, 'quote.form.titleRequired'),
  description: z.string().optional(),
  status_quote: z.string().optional(),
  quote_send_date: z.string().optional(),
  quote_validate_date: z.string().optional(),
  observations: z.string().optional(),
  client: z
    .object({
      id: z.union([z.string(), z.number()]).transform((val) => String(val)),
      name: z.string(),
    })
    .optional(),
  total_value: z.number().min(0, 'quote.form.totalValueRequired'),
  discount: z.number().min(0, 'quote.form.discountInvalid').optional(),
  notification: z
    .object({
      id: z.string(),
    })
    .optional(),
})
