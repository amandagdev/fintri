import type { AxiosError } from 'axios'
import axios from 'axios'

import { mapStrapiErrorMessage } from '@/utils/strapi-error-map'

export const authService = {
  async login(data: { identifier: string; password: string }) {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, data)
      return res.data
    } catch (err) {
      const error = err as AxiosError<{ error: { message?: string } }>
      const message = error.response?.data?.error?.message || error.message || 'Erro desconhecido'
      throw new Error(mapStrapiErrorMessage(message))
    }
  },

  async register(data: { username: string; email: string; password: string }) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
        data,
      )
      return res.data
    } catch (err) {
      const error = err as AxiosError<{ error: { message?: string } }>
      const message = error.response?.data?.error?.message || error.message || 'Erro desconhecido'
      throw new Error(mapStrapiErrorMessage(message))
    }
  },
}
