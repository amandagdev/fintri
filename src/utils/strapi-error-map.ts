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
  if (!message) return 'errors.default'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'errors.emailTaken',
  }

  return errorKeyMap[message] || 'errors.default'
}

export function mapBudgetErrorToKey(message?: string): string {
  if (!message) return 'errors.default'

  const errorKeyMap: Record<string, string> = {
    'This attribute must be unique': 'budget.errors.nameAlreadyTaken',
    // Add other common Strapi error mappings here
  }

  return errorKeyMap[message] || 'errors.default'
}
