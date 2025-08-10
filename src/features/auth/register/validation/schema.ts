import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'O e-mail fornecido não é válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
})
