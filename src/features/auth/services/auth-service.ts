import type { AxiosError } from 'axios'

import { axiosInstance } from '@/lib/axios'
import { mapLoginErrorToKey, mapRegisterErrorToKey } from '@/utils/strapi-error-map'

export const authService = {
  async login(data: { identifier: string; password: string }) {
    try {
      const res = await axiosInstance.post('/api/auth/local', data)
      return res.data
    } catch (err) {
      console.log(err)
      const error = err as AxiosError<{ error: { message?: string } }>
      const message = error.response?.data?.error?.message || error.message
      throw new Error(mapLoginErrorToKey(message))
    }
  },

  async register(data: { username: string; email: string; password: string }) {
    try {
      const res = await axiosInstance.post('/api/auth/local/register', data)
      return res.data
    } catch (err) {
      const error = err as AxiosError<{ error: { message?: string } }>
      const message = error.response?.data?.error?.message || error.message
      throw new Error(mapRegisterErrorToKey(message))
    }
  },
}
