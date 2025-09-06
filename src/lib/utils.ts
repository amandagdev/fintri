export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return '-'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue)
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return '-'
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return '-'
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  } catch {
    return '-'
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return '-'
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return '-'
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return '-'
  }
}

export function formatNumber(
  value: number | string | null | undefined,
  decimals: number = 2,
): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return '-'
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue)
}

export function getCurrentDate(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export function formatDateForInput(dateString?: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  } catch {
    return ''
  }
}
