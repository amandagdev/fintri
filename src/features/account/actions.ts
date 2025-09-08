'use server'

import { revalidatePath } from 'next/cache'

import { unformatCNPJ, unformatCPF, unformatPhone } from '@/lib/utils'

import {
  removeCompanyLogo,
  updateCompanyData,
  updatePassword,
  updatePersonalData,
} from './services/user-service'
import type { UpdatePasswordPayload, UpdatePersonalDataPayload, UserState } from './types'
import { CompanyDataSchema, PasswordSchema, PersonalDataSchema } from './validation/schemas'

export async function updatePersonalDataAction(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const fullName = formData.get('fullName')
  const phone = formData.get('phone')
  const cpf = formData.get('cpf')

  const data: UpdatePersonalDataPayload = {
    fullName: fullName && typeof fullName === 'string' ? fullName : undefined,
    phone: phone && typeof phone === 'string' ? unformatPhone(phone) : undefined,
    cpf: cpf && typeof cpf === 'string' ? unformatCPF(cpf) : undefined,
  }

  const parsed = PersonalDataSchema.safeParse(data)

  if (!parsed.success) {
    return {
      message: 'validationFailed',
      errors: parsed.error.flatten().fieldErrors as UserState['errors'],
    }
  }

  try {
    await updatePersonalData(parsed.data)
    revalidatePath('/account')
    return { message: 'success.personalDataUpdated' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}

export async function updateCompanyDataAction(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const name = formData.get('name')
  const cnpj = formData.get('cnpj')
  const address = formData.get('address')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const logo = formData.get('logo')

  const basicData = {
    company: {
      name: name && typeof name === 'string' ? name : '',
      cnpj: cnpj && typeof cnpj === 'string' ? unformatCNPJ(cnpj) : '',
      address: address && typeof address === 'string' ? address : '',
      email: email && typeof email === 'string' ? email : '',
      phone: phone && typeof phone === 'string' ? unformatPhone(phone) : '',
    },
  }

  const parsed = CompanyDataSchema.safeParse(basicData)

  if (!parsed.success) {
    return {
      message: 'validationFailed',
      errors: parsed.error.flatten().fieldErrors as UserState['errors'],
    }
  }

  try {
    await updateCompanyData(parsed.data, logo as File | null)
    revalidatePath('/account')
    revalidatePath('/pt/account')
    return { message: 'success.companyDataUpdated' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}

export async function removeCompanyLogoAction(): Promise<UserState> {
  try {
    await removeCompanyLogo()
    revalidatePath('/account')
    revalidatePath('/pt/account')
    return { message: 'success.logoRemoved' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}

export async function updatePasswordAction(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const currentPassword = formData.get('currentPassword')
  const password = formData.get('password')
  const passwordConfirmation = formData.get('passwordConfirmation')

  const data: UpdatePasswordPayload = {
    currentPassword: currentPassword && typeof currentPassword === 'string' ? currentPassword : '',
    password: password && typeof password === 'string' ? password : '',
    passwordConfirmation:
      passwordConfirmation && typeof passwordConfirmation === 'string' ? passwordConfirmation : '',
  }

  const parsed = PasswordSchema.safeParse(data)

  if (!parsed.success) {
    return {
      message: 'validationFailed',
      errors: parsed.error.flatten().fieldErrors as UserState['errors'],
    }
  }

  try {
    await updatePassword(parsed.data)
    return { message: 'success.passwordUpdated' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}
