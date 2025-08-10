export interface RegisterFormData {
  username?: string
  email?: string
  password?: string
}

export interface StrapiAuthResponse {
  jwt: string
  user: {
    id: number
    username: string
    email: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface StrapiErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: object
  }
}
