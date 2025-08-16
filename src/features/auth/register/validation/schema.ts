import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(1, { message: 'errors.usernameTooShort' }),
  email: z.string().email({ message: 'errors.invalidEmail' }),
  password: z.string().min(6, { message: 'errors.passwordTooShort' }),
})
