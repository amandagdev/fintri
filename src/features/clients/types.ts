export type ClientFormData = {
  name: string
  email: string
  phone?: string
  cpf_or_cnpj?: string
  address?: string
  documentId: string
}

export type Client = {
  id: number
  name: string
  email: string
  phone?: string
  cpf_or_cnpj?: string
  documentId: string
}
