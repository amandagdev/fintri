import { z } from 'zod'

export const PersonalDataSchema = z.object({
  fullName: z.string().min(3, 'errors.fullNameTooShort').optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
})

export const CompanyDataSchema = z.object({
  company: z.object({
    name: z.string().optional(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email('errors.invalidEmail').optional(),
    logo: z.string().optional(),
  }),
})

export const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'errors.currentPasswordRequired'),
    password: z.string().min(6, 'errors.passwordTooShort'),
    passwordConfirmation: z.string().min(1, 'errors.passwordConfirmationRequired'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'errors.passwordsDoNotMatch',
    path: ['passwordConfirmation'],
  })
