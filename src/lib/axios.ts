import axios from 'axios'

const getStrapiUrl = () => {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
}

export const createAuthHeaders = (jwt: string): Record<string, string> => {
  return {
    Authorization: `Bearer ${jwt}`,
  }
}

export const getStrapiImageUrl = (imagePath: string) => {
  if (!imagePath) return ''

  const baseUrl = getStrapiUrl()
  return `${baseUrl}${imagePath}`
}

export const axiosInstance = axios.create({
  baseURL: getStrapiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    })
    return Promise.reject(error as Error)
  },
)

export const axiosUploadInstance = axios.create({
  baseURL: getStrapiUrl(),
  timeout: 30000,
  maxContentLength: 2 * 1024 * 1024,
  maxBodyLength: 2 * 1024 * 1024,
})
