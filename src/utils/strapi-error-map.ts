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
  if (!message) return 'errors.clientUpdateFailed'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'errors.emailTaken',
    'Not Found': 'errors.clientNotFound',
    'Invalid key id': 'errors.invalidKeyId',
    Forbidden: 'errors.unauthorized',
    Unauthorized: 'errors.unauthorized',
    ValidationError: 'errors.validationError',
    'Bad Request': 'errors.badRequest',
  }

  return errorKeyMap[message] || `errors.clientUpdateFailed: ${message}`
}

export function mapQuoteErrorToKey(message?: string): string {
  if (!message) return 'errors.quoteUpdateFailed'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'errors.nameAlreadyTaken',
    'Not Found': 'errors.quoteNotFound',
    'Invalid key id': 'errors.invalidKeyId',
    'Invalid key quote_type': 'errors.invalidKeyId',
    'Invalid key item_type': 'errors.invalidKeyId',
    'Invalid key items': 'errors.invalidKeyId',
    'Invalid format, expected a timestamp or an ISO date': 'errors.invalidDateFormat',
    Forbidden: 'errors.unauthorized',
    Unauthorized: 'errors.unauthorized',
    ValidationError: 'errors.validationError',
    'Bad Request': 'errors.badRequest',
  }

  return errorKeyMap[message] || `errors.quoteUpdateFailed: ${message}`
}
