import type { AxiosError } from 'axios'
import { cookies } from 'next/headers'

import { axiosInstance } from '@/lib/axios'
import { mapClientErrorToKey } from '@/utils/strapi-error-map'

import {
  createClient,
  deleteClient,
  getClientByDocumentId,
  getClients,
  updateClient,
} from './service'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/axios', () => ({
  axiosInstance: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('@/utils/strapi-error-map', () => ({
  mapClientErrorToKey: jest.fn(),
}))

describe('Client Service', () => {
  const mockJwt = 'mock-jwt-token'
  const mockCookieStore = {
    get: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCookieStore.get.mockReturnValue({ value: mockJwt })
    ;(cookies as jest.Mock).mockResolvedValue(mockCookieStore)
  })

  describe('createClient', () => {
    const mockPayload = {
      data: {
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11987654321',
        taxId: '123.456.789-00',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      },
    }

    it('successfully creates a client', async () => {
      const mockResponse = { data: { id: 1, ...mockPayload.data } }
      ;(axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse)

      const result = await createClient(mockPayload)

      expect(cookies).toHaveBeenCalled()
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/clients', mockPayload, {
        headers: { Authorization: `Bearer ${mockJwt}` },
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error when JWT is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      await expect(createClient(mockPayload)).rejects.toThrow('errors.unauthenticated')

      expect(axiosInstance.post).not.toHaveBeenCalled()
    })

    it('handles API errors correctly', async () => {
      const mockError = {
        response: {
          data: {
            error: { message: 'Email já existe' },
          },
        },
      } as AxiosError<{ error: { message?: string } }>

      ;(axiosInstance.post as jest.Mock).mockRejectedValue(mockError)
      ;(mapClientErrorToKey as jest.Mock).mockReturnValue('errors.emailTaken')

      await expect(createClient(mockPayload)).rejects.toThrow('errors.emailTaken')

      expect(mapClientErrorToKey).toHaveBeenCalledWith('Email já existe')
    })
  })

  describe('getClients', () => {
    it('successfully fetches clients', async () => {
      const mockClients = [
        { id: '1', name: 'João Silva', email: 'joao.silva@exemplo.com' },
        { id: '2', name: 'Maria Santos', email: 'maria.santos@exemplo.com' },
      ]
      const mockResponse = { data: { data: mockClients } }
      ;(axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getClients()

      expect(cookies).toHaveBeenCalled()
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/clients', {
        headers: {
          Authorization: `Bearer ${mockJwt}`,
          'Cache-Control': 'no-store',
        },
      })
      expect(result).toEqual(mockClients)
    })

    it('returns empty array when JWT is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await getClients()

      expect(result).toEqual([])
      expect(axiosInstance.get).not.toHaveBeenCalled()
    })

    it('returns empty array on API error', async () => {
      ;(axiosInstance.get as jest.Mock).mockRejectedValue(new Error('API Error'))

      const result = await getClients()

      expect(result).toEqual([])
    })
  })

  describe('getClientByDocumentId', () => {
    const documentId = 'client-123'

    it('successfully fetches client by document ID', async () => {
      const mockClient = { id: '1', documentId, name: 'João Silva' }
      const mockResponse = { data: { data: [mockClient] } }
      ;(axiosInstance.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await getClientByDocumentId(documentId)

      expect(cookies).toHaveBeenCalled()
      expect(axiosInstance.get).toHaveBeenCalledWith(
        `/api/clients?filters[documentId][$eq]=${documentId}&populate=*`,
        { headers: { Authorization: `Bearer ${mockJwt}` } },
      )
      expect(result).toEqual(mockClient)
    })

    it('throws error when JWT is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      await expect(getClientByDocumentId(documentId)).rejects.toThrow('errors.unauthenticated')

      expect(axiosInstance.get).not.toHaveBeenCalled()
    })

    it('throws error on API failure', async () => {
      ;(axiosInstance.get as jest.Mock).mockRejectedValue(new Error('API Error'))

      await expect(getClientByDocumentId(documentId)).rejects.toThrow('errors.clientFetchFailed')
    })
  })

  describe('updateClient', () => {
    const clientId = 123
    const mockPayload = {
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@exemplo.com',
        phone: '21987654321',
        taxId: '987.654.321-00',
        address: 'Avenida Paulista, 1000 - São Paulo, SP',
      },
    }

    it('successfully updates a client', async () => {
      const mockResponse = { data: { id: clientId, ...mockPayload.data } }
      ;(axiosInstance.put as jest.Mock).mockResolvedValue(mockResponse)

      const result = await updateClient(clientId, mockPayload)

      expect(cookies).toHaveBeenCalled()
      expect(axiosInstance.put).toHaveBeenCalledWith(`/api/clients/${clientId}`, mockPayload, {
        headers: { Authorization: `Bearer ${mockJwt}` },
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('throws error when JWT is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      await expect(updateClient(clientId, mockPayload)).rejects.toThrow('errors.unauthenticated')

      expect(axiosInstance.put).not.toHaveBeenCalled()
    })

    it('handles API errors correctly', async () => {
      const mockError = {
        response: {
          data: {
            error: { message: 'Cliente não encontrado' },
          },
        },
      } as AxiosError<{ error: { message?: string } }>

      ;(axiosInstance.put as jest.Mock).mockRejectedValue(mockError)
      ;(mapClientErrorToKey as jest.Mock).mockReturnValue('errors.clientNotFound')

      await expect(updateClient(clientId, mockPayload)).rejects.toThrow('errors.clientNotFound')

      expect(mapClientErrorToKey).toHaveBeenCalledWith('Cliente não encontrado')
    })
  })

  describe('deleteClient', () => {
    const documentId = 'client-123'

    it('successfully deletes a client', async () => {
      ;(axiosInstance.delete as jest.Mock).mockResolvedValue({})

      await deleteClient(documentId)

      expect(cookies).toHaveBeenCalled()
      expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/clients/${documentId}`, {
        headers: { Authorization: `Bearer ${mockJwt}` },
      })
    })

    it('throws error when JWT is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      await expect(deleteClient(documentId)).rejects.toThrow('clients.errors.unauthenticated')

      expect(axiosInstance.delete).not.toHaveBeenCalled()
    })

    it('throws error on API failure', async () => {
      ;(axiosInstance.delete as jest.Mock).mockRejectedValue(new Error('API Error'))

      await expect(deleteClient(documentId)).rejects.toThrow('clients.errors.deleteFailed')
    })
  })
})
