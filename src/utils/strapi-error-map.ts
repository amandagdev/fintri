export function mapLoginErrorToKey(message?: string): string {
  if (!message) return 'errors.loginError'

  const errorKeyMap: Record<string, string> = {
    'Invalid identifier or password': 'errors.invalidCredentials',
  }

  return errorKeyMap[message] || 'errors.default'
}

export function mapRegisterErrorToKey(message?: string): string {
  if (!message) return 'errors.default'

  const errorKeyMap: Record<string, string> = {
    'Email or Username are already taken': 'errors.emailOrUsernameTaken',
    'password must be at least 6 characters': 'errors.passwordTooShort',
  }

  return errorKeyMap[message] || 'errors.default'
}

export function mapClientErrorToKey(message?: string): string {
  if (!message) return 'clientUpdateFailed'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'emailTaken',
    'Not Found': 'clientNotFound',
    'Invalid key id': 'invalidKeyId',
    Forbidden: 'unauthorized',
    Unauthorized: 'unauthorized',
    ValidationError: 'validationError',
    'Bad Request': 'badRequest',
    'An unexpected response was received from the server': 'unexpectedResponse',
    'Network Error': 'networkError',
    'Request failed with status code 400': 'badRequest',
    'Request failed with status code 500': 'serverError',
  }

  return errorKeyMap[message] || `clientUpdateFailed: ${message}`
}

export function mapQuoteErrorToKey(message?: string): string {
  if (!message) return 'quoteUpdateFailed'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'nameAlreadyTaken',
    'Not Found': 'quoteNotFound',
    'Invalid key id': 'invalidKeyId',
    'Invalid key quote_type': 'invalidKeyId',
    'Invalid key item_type': 'invalidKeyId',
    'Invalid key items': 'invalidKeyId',
    'Invalid format, expected a timestamp or an ISO date': 'invalidDateFormat',
    Forbidden: 'unauthorized',
    Unauthorized: 'unauthorized',
    ValidationError: 'validationError',
    'Bad Request': 'badRequest',
  }

  return errorKeyMap[message] || `quoteUpdateFailed: ${message}`
}
