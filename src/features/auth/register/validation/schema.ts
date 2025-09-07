import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(1, { message: 'usernameTooShort' }),
  email: z.string().email({ message: 'invalidEmail' }),
  password: z.string().min(6, { message: 'passwordTooShort' }),
})
