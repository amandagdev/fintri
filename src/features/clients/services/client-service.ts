'use client'

import { axiosInstance } from '@/lib/axios'
import { handleClientApiError } from '@/lib/service-utils'

import type { Client } from '../types'

export async function getClientsClient(): Promise<Client[]> {
  try {
    const response = await axiosInstance.get('/api/clients')

    return response.data.data || []
  } catch (error) {
    handleClientApiError(error, 'getClientsClient')
    return []
  }
}
