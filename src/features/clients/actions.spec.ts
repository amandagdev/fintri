import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { addClientAction, deleteClientAction, updateClientAction, type State } from './actions'
import { createClient, deleteClient, updateClient } from './services/service'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('REDIRECT')
  }),
}))

jest.mock('./services/service', () => ({
  createClient: jest.fn(),
  updateClient: jest.fn(),
  deleteClient: jest.fn(),
}))

describe('Client Actions', () => {
  const mockFormData = (data: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addClientAction', () => {
    it('successfully adds a client and redirects', async () => {
      const formData = mockFormData({
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11987654321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      })

      ;(createClient as jest.Mock).mockResolvedValue(undefined)

      await expect(addClientAction({} as State, formData)).rejects.toThrow('REDIRECT')

      expect(createClient).toHaveBeenCalledWith({
        data: {
          name: 'João Silva',
          email: 'joao.silva@exemplo.com',
          phone: '11987654321',
          cpf_or_cnpj: '123.456.789-00',
          address: 'Rua das Flores, 123 - São Paulo, SP',
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/clients')
      expect(redirect).toHaveBeenCalledWith('/clients?success=true')
    })

    it('returns validation errors for invalid data', async () => {
      const formData = mockFormData({
        name: '',
        email: 'invalid-email',
        phone: '11987654321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      })

      const result = await addClientAction({} as State, formData)

      expect(result.errors).toBeDefined()
      expect(createClient).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('returns error message when service fails', async () => {
      const formData = mockFormData({
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11987654321',
        cpf_or_cnpj: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      })

      const errorMessage = 'Email já existe'
      ;(createClient as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await addClientAction({} as State, formData)

      expect(result.message).toBe(errorMessage)
      expect(createClient).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('updateClientAction', () => {
    it('successfully updates a client and redirects', async () => {
      const formData = mockFormData({
        name: 'Maria Santos',
        email: 'maria.santos@exemplo.com',
        phone: '21987654321',
        cpf_or_cnpj: '987.654.321-00',
        address: 'Avenida Paulista, 1000 - São Paulo, SP',
      })

      ;(updateClient as jest.Mock).mockResolvedValue(undefined)

      await expect(updateClientAction('client-123', {} as State, formData)).rejects.toThrow(
        'REDIRECT',
      )

      expect(updateClient).toHaveBeenCalledWith('client-123', {
        data: {
          name: 'Maria Santos',
          email: 'maria.santos@exemplo.com',
          phone: '21987654321',
          cpf_or_cnpj: '987.654.321-00',
          address: 'Avenida Paulista, 1000 - São Paulo, SP',
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/clients')
      expect(revalidatePath).toHaveBeenCalledWith('/clients/edit/client-123')
      expect(redirect).toHaveBeenCalledWith('/clients?updated=true')
    })

    it('returns validation errors for invalid data', async () => {
      const formData = mockFormData({
        name: '',
        email: 'invalid-email',
        phone: '21987654321',
        cpf_or_cnpj: '987.654.321-00',
        address: 'Avenida Paulista, 1000 - São Paulo, SP',
      })

      const result = await updateClientAction('client-123', {} as State, formData)

      expect(result.errors).toBeDefined()
      expect(updateClient).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('returns error message when service fails', async () => {
      const formData = mockFormData({
        name: 'Maria Santos',
        email: 'maria.santos@exemplo.com',
        phone: '21987654321',
        cpf_or_cnpj: '987.654.321-00',
        address: 'Avenida Paulista, 1000 - São Paulo, SP',
      })

      const errorMessage = 'Cliente não encontrado'
      ;(updateClient as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await updateClientAction('client-123', {} as State, formData)

      expect(result.message).toBe(errorMessage)
      expect(updateClient).toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('deleteClientAction', () => {
    it('successfully deletes a client', async () => {
      ;(deleteClient as jest.Mock).mockResolvedValue(undefined)

      const result = await deleteClientAction('client-123')

      expect(result.success).toBe(true)
      expect(result.message).toBe('deleteSuccessMessage')
      expect(deleteClient).toHaveBeenCalledWith('client-123')
      expect(revalidatePath).toHaveBeenCalledWith('/clients')
    })

    it('returns error when documentId is missing', async () => {
      const result = await deleteClientAction('')

      expect(result.success).toBe(false)
      expect(result.message).toBe('errors.missingId')
      expect(deleteClient).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns error when service fails', async () => {
      const errorMessage = 'Cliente não encontrado'
      ;(deleteClient as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const result = await deleteClientAction('client-123')

      expect(result.success).toBe(false)
      expect(result.message).toBe(errorMessage)
      expect(deleteClient).toHaveBeenCalledWith('client-123')
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })
})
