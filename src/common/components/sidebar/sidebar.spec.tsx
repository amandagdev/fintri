import { render, screen } from '@testing-library/react'

import Sidebar from './sidebar'

const mockTranslations = {
  'sidebar.title': 'Fintri',
  'sidebar.subtitle': 'Gestão de orçamentos',
  'sidebar.home': 'Dashboard',
  'sidebar.createQuote': 'Criar orçamento',
  'sidebar.myQuotes': 'Meus orçamentos',
  'sidebar.addClient': 'Adicionar cliente',
  'sidebar.myClients': 'Meus clientes',
  'sidebar.analytics': 'Minhas análises',
  'sidebar.account': 'Minha conta',
  'sidebar.logout': 'Sair',
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

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

describe('Sidebar', () => {
  it('should render logo and title', () => {
    render(<Sidebar />)

    expect(screen.getByText('Fintri')).toBeInTheDocument()
    expect(screen.getByText('Gestão de orçamentos')).toBeInTheDocument()
  })

  it('should render all menu items', () => {
    render(<Sidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Criar orçamento')).toBeInTheDocument()
    expect(screen.getByText('Meus orçamentos')).toBeInTheDocument()
    expect(screen.getByText('Adicionar cliente')).toBeInTheDocument()
    expect(screen.getByText('Meus clientes')).toBeInTheDocument()
    expect(screen.getByText('Minha conta')).toBeInTheDocument()
  })

  it('should render disabled analytics option', () => {
    render(<Sidebar />)

    const analyticsOption = screen.getByText('Minhas análises')
    expect(analyticsOption).toBeInTheDocument()
    expect(analyticsOption).toHaveClass('text-gray-300 cursor-not-allowed')
  })

  it('should render logout button', () => {
    render(<Sidebar />)

    expect(screen.getByText('Sair')).toBeInTheDocument()
  })

  it('should have correct links for active items', () => {
    render(<Sidebar />)

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: /criar orçamento/i })).toHaveAttribute(
      'href',
      '/quote/add',
    )
    expect(screen.getByRole('link', { name: /meus orçamentos/i })).toHaveAttribute('href', '/quote')
    expect(screen.getByRole('link', { name: /adicionar cliente/i })).toHaveAttribute(
      'href',
      '/clients/add',
    )
    expect(screen.getByRole('link', { name: /meus clientes/i })).toHaveAttribute('href', '/clients')
    expect(screen.getByRole('link', { name: /minha conta/i })).toHaveAttribute('href', '/account')
  })

  it('should highlight active menu item', () => {
    render(<Sidebar />)

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveClass('bg-[#1b6d71] text-white')
  })

  it('should have correct CSS classes for sidebar', () => {
    render(<Sidebar />)

    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass(
      'w-72 bg-white text-gray-500 flex flex-col min-h-screen border-r border-gray-200',
    )
  })
})
