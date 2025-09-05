import axios from 'axios'

const getStrapiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.STRAPI_URL || 'http://localhost:1337'
  }

  return process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL
}

export const axiosInstance = axios.create({
  baseURL: getStrapiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})
