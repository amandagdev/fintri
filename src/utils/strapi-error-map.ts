export function mapStrapiErrorMessage(message?: string) {
  const messages: Record<string, string> = {
    'Invalid identifier or password': 'E-mail ou senha inválidos.',
    'Email or Username are already taken': 'Este e-mail já está em uso.',
    'password must be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Please provide your password.': 'A senha é obrigatória.',
    'Please provide your username or your email.': 'E-mail ou nome de usuário são obrigatórios.',
  }

  return message && messages[message] ? messages[message] : 'Ocorreu um erro, tente novamente.'
}
