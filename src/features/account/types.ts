export interface User {
  username: string
  email: string
  phone?: string
  cpf?: string
}

export interface Company {
  name?: string
  cnpj?: string
  address?: string
  email?: string
  phone?: string
  logo?: string
}

export interface UpdatePersonalDataPayload {
  fullName?: string
  phone?: string
  cpf?: string
}

export interface UpdateCompanyDataPayload {
  company: Company
}

export interface UpdatePasswordPayload {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

export interface UserState {
  message?: string
  errors?: {
    fullName?: string[]
    phone?: string[]
    cpf?: string[]
    company?: {
      name?: string[]
      cnpj?: string[]
      address?: string[]
      email?: string[]
      phone?: string[]
      logo?: string[]
    }
    currentPassword?: string[]
    password?: string[]
    passwordConfirmation?: string[]
  }
}
