'use server'

import { unformatCPF, unformatPhone } from '@/lib/utils'

import { updatePersonalData } from '../services/personal-service'
import type { UpdatePersonalDataPayload, UserState } from '../types'
import { PersonalDataSchema } from '../validation/schemas'

export async function updatePersonalDataAction(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const fullName = (formData.get('fullName') ||
    formData.get('username')) as FormDataEntryValue | null
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
    return { message: 'success.personalDataUpdated' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}
