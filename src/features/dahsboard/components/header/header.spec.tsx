import { render, screen } from '@testing-library/react'

import Header from './header'

const mockTranslations = {
  'dashboard.title': 'Orçamentos',
  'dashboard.description': 'Visualize métricas importantes e gerencie todos os seus orçamentos.',
  'dashboard.createQuote': 'Criar Orçamento',
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => mockTranslations[key as keyof typeof mockTranslations],
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

describe('Header', () => {
  it('should render title and description', () => {
    render(<Header />)

    expect(screen.getByText('Orçamentos')).toBeInTheDocument()
    expect(
      screen.getByText('Visualize métricas importantes e gerencie todos os seus orçamentos.'),
    ).toBeInTheDocument()
  })

  it('should render create quote button', () => {
    render(<Header />)

    const button = screen.getByRole('link')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/quote/add')
  })

  it('should have correct CSS classes', () => {
    render(<Header />)

    const title = screen.getByText('Orçamentos')
    expect(title).toHaveClass('text-2xl font-bold text-gray-600')

    const description = screen.getByText(
      'Visualize métricas importantes e gerencie todos os seus orçamentos.',
    )
    expect(description).toHaveClass('text-gray-500 mt-1')
  })

  it('should render button with correct classes', () => {
    render(<Header />)

    const button = screen.getByRole('link', { name: /criar orçamento/i })
    expect(button).toHaveClass(
      'btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center',
    )
  })
})
