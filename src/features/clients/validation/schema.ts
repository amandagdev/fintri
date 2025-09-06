import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(3, { message: 'errors.fullNameTooShort' }),
  email: z.string().email({ message: 'errors.invalidEmail' }),
  phone: z.string().optional(),
  cpf_or_cnpj: z.string().optional(),
  address: z.string().optional(),
})
