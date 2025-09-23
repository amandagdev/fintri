import { render, screen } from '@testing-library/react'

import type { Quote } from '@/features/quote/state'

import { StatsCards } from './stats-cards'

const mockQuotes: Quote[] = [
  {
    id: '1',
    documentId: 'doc1',
    title: 'Quote 1',
    total_value: 1000,
    status_quote: 'accepted',
    quote_send_date: '2024-01-15',
    client: { id: '1', name: 'Client 1' },
  },
  {
    id: '2',
    documentId: 'doc2',
    title: 'Quote 2',
    total_value: 2000,
    status_quote: 'pending',
    quote_send_date: '2024-01-20',
    client: { id: '2', name: 'Client 2' },
  },
]

const mockTranslations = {
  'dashboard.stats.totalQuotes': 'Total de Orçamentos',
  'dashboard.stats.currentMonthQuotes': 'Criados Este Mês',
  'dashboard.stats.totalValue': 'Valor Total',
  'dashboard.stats.conversionRate': 'Taxa de Conversão',
  'dashboard.stats.totalValueDesc': 'Total de todos os orçamentos aceitos',
  'dashboard.stats.conversionRateDesc': 'Aceitos / Enviados',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    // Remove 'dashboard.stats.' prefix and return the translation
    const cleanKey = key.replace('dashboard.stats.', '')
    return mockTranslations[`dashboard.stats.${cleanKey}` as keyof typeof mockTranslations] || key
  },
}))

jest.mock('../../hooks/use-dashboard-stats', () => ({
  useDashboardStats: jest.fn(() => ({
    totalQuotes: 2,
    currentMonthQuotes: 2,
    totalAcceptedValue: 1000,
    conversionRate: 50.0,
  })),
}))

describe('StatsCards', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-25'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render all stat cards', () => {
    render(<StatsCards quotes={mockQuotes} />)

    expect(screen.getByText('Total de Orçamentos')).toBeInTheDocument()
    expect(screen.getByText('Criados Este Mês')).toBeInTheDocument()
    expect(screen.getByText('Valor Total')).toBeInTheDocument()
    expect(screen.getByText('Taxa de Conversão')).toBeInTheDocument()
  })

  it('should display correct values', () => {
    render(<StatsCards quotes={mockQuotes} />)

    expect(screen.getAllByText('2')).toHaveLength(2)
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })

  it('should display correct descriptions', () => {
    render(<StatsCards quotes={mockQuotes} />)

    expect(screen.getByText('Total de todos os orçamentos aceitos')).toBeInTheDocument()
    expect(screen.getByText('Aceitos / Enviados')).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    render(<StatsCards quotes={mockQuotes} />)

    const cards = screen
      .getAllByRole('generic')
      .filter((el) =>
        el.className.includes('stat bg-white rounded-lg shadow-sm border border-base-200'),
      )
    expect(cards).toHaveLength(4)
  })

  it('should handle empty quotes array', () => {
    render(<StatsCards quotes={[]} />)

    // Mock returns the same values regardless of input
    expect(screen.getAllByText('2')).toHaveLength(2)
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })
})
