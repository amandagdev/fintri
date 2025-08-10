export type LoginFormData = {
  identifier: string
  password: string
}

export type StrapiAuthResponse = {
  jwt: string
  user: {
    id: number
    username: string
    email: string
  }
}

export type StrapiErrorResponse = {
  error: {
    message: string
    status: number
    details?: unknown
  }
}
