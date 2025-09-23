'use server'

import { revalidatePath } from 'next/cache'

import { unformatCNPJ, unformatPhone } from '@/lib/utils'

import { removeCompanyLogo, updateCompanyData } from '../services/company-service'
import type { UserState } from '../types'
import { CompanyDataSchema } from '../validation/schemas'

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
    const file = logo instanceof File && logo.size > 0 ? (logo as File) : null
    await updateCompanyData(parsed.data, file)
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
