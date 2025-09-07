import { z } from 'zod'

const QuoteItemSchema = z.object({
  id: z.string().optional(),
  item_type: z.enum(['service', 'product']),
  item_name: z.string().min(1, 'Nome do item é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unit_price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  total: z.number().min(0, 'Total deve ser maior ou igual a 0'),
})

export const QuoteSchema = z.object({
  id: z.string().optional(),
  documentId: z.string().optional(),
  title: z.string().optional(),
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
  total_value: z.number().min(0, 'form.totalValueRequired'),
  discount: z.number().min(0, 'form.discountInvalid').optional(),
  notification: z
    .object({
      id: z.string(),
    })
    .optional(),
  quote_type: z.enum(['simple', 'detailed']).optional(),
  items: z.array(QuoteItemSchema).optional(),
})
