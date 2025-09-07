import { renderHook } from '@testing-library/react'

import type { Quote } from '@/features/quote/state'

import { useDashboardStats } from './use-dashboard-stats'

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
  {
    id: '3',
    documentId: 'doc3',
    title: 'Quote 3',
    total_value: 1500,
    status_quote: 'accepted',
    quote_send_date: '2024-02-10',
    client: { id: '3', name: 'Client 3' },
  },
  {
    id: '4',
    documentId: 'doc4',
    title: 'Quote 4',
    total_value: 3000,
    status_quote: 'rejected',
    client: { id: '4', name: 'Client 4' },
  },
]

describe('useDashboardStats', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-25'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should calculate total quotes correctly', () => {
    const { result } = renderHook(() => useDashboardStats({ quotes: mockQuotes }))

    expect(result.current.totalQuotes).toBe(4)
  })

  it('should calculate current month quotes correctly', () => {
    const { result } = renderHook(() => useDashboardStats({ quotes: mockQuotes }))

    expect(result.current.currentMonthQuotes).toBe(2)
  })

  it('should calculate total accepted value correctly', () => {
    const { result } = renderHook(() => useDashboardStats({ quotes: mockQuotes }))

    expect(result.current.totalAcceptedValue).toBe(2500)
  })

  it('should calculate conversion rate correctly', () => {
    const { result } = renderHook(() => useDashboardStats({ quotes: mockQuotes }))

    expect(result.current.conversionRate).toBeCloseTo(66.7, 1)
  })

  it('should handle empty quotes array', () => {
    const { result } = renderHook(() => useDashboardStats({ quotes: [] }))

    expect(result.current.totalQuotes).toBe(0)
    expect(result.current.currentMonthQuotes).toBe(0)
    expect(result.current.totalAcceptedValue).toBe(0)
    expect(result.current.conversionRate).toBe(0)
  })

  it('should handle quotes without send date', () => {
    const quotesWithoutSendDate: Quote[] = [
      {
        id: '1',
        documentId: 'doc1',
        title: 'Quote 1',
        total_value: 1000,
        status_quote: 'accepted',
        client: { id: '1', name: 'Client 1' },
      },
    ]

    const { result } = renderHook(() => useDashboardStats({ quotes: quotesWithoutSendDate }))

    expect(result.current.currentMonthQuotes).toBe(0)
    expect(result.current.conversionRate).toBe(0)
  })

  it('should handle quotes with zero total value', () => {
    const quotesWithZeroValue: Quote[] = [
      {
        id: '1',
        documentId: 'doc1',
        title: 'Quote 1',
        total_value: 0,
        status_quote: 'accepted',
        quote_send_date: '2024-01-15',
        client: { id: '1', name: 'Client 1' },
      },
    ]

    const { result } = renderHook(() => useDashboardStats({ quotes: quotesWithZeroValue }))

    expect(result.current.totalAcceptedValue).toBe(0)
  })

  it('should recalculate when quotes change', () => {
    const { result, rerender } = renderHook(({ quotes }) => useDashboardStats({ quotes }), {
      initialProps: { quotes: mockQuotes.slice(0, 2) },
    })

    expect(result.current.totalQuotes).toBe(2)

    rerender({ quotes: mockQuotes })

    expect(result.current.totalQuotes).toBe(4)
  })
})
