export function mapLoginErrorToKey(message?: string): string {
  if (!message) return 'loginError'

  const errorKeyMap: Record<string, string> = {
    'Invalid identifier or password': 'invalidCredentials',
  }

  return errorKeyMap[message] || 'default'
}

export function mapRegisterErrorToKey(message?: string): string {
  if (!message) return 'default'

  const errorKeyMap: Record<string, string> = {
    'Email or Username are already taken': 'emailOrUsernameTaken',
    'password must be at least 6 characters': 'passwordTooShort',
  }

  return errorKeyMap[message] || 'default'
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
