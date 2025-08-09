import type { AxiosError } from 'axios'
import axios from 'axios'

import type { RegisterFormData, StrapiAuthResponse, StrapiErrorResponse } from '../types'

const STRAPI_URL = process.env.STRAPI_URL

export const authService = {
  register: async (data: RegisterFormData): Promise<StrapiAuthResponse> => {
    try {
      const response = await axios.post<StrapiAuthResponse>(
        `${STRAPI_URL}/api/auth/local/register`,
        data,
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<StrapiErrorResponse>
        const message =
          axiosError.response?.data?.error?.message || axiosError.message || 'Erro ao registrar.'

        throw new Error(message)
      }
      throw new Error('Erro inesperado, tenta novamente.')
    }
  },
}
