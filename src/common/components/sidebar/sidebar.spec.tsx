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
  it('should render sidebar structure', () => {
    render(<Sidebar />)

    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByAltText('Logo')).toBeInTheDocument()
  })

  it('should render all menu links', () => {
    render(<Sidebar />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(7) // Logo + 6 menu items
  })

  it('should render disabled analytics option', () => {
    render(<Sidebar />)

    const disabledElements = screen
      .getAllByRole('generic')
      .filter((el) => el.className.includes('cursor-not-allowed'))
    expect(disabledElements).toHaveLength(1)
  })

  it('should render logout button', () => {
    render(<Sidebar />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
  })

  it('should have correct links for active items', () => {
    render(<Sidebar />)

    const links = screen.getAllByRole('link')
    const hrefs = links.map((link) => link.getAttribute('href'))

    expect(hrefs).toContain('/dashboard')
    expect(hrefs).toContain('/quote/add')
    expect(hrefs).toContain('/quote')
    expect(hrefs).toContain('/clients/add')
    expect(hrefs).toContain('/clients')
    expect(hrefs).toContain('/account')
  })

  it('should highlight active menu item', () => {
    render(<Sidebar />)

    const links = screen.getAllByRole('link')
    const dashboardLink = links.find((link) => link.getAttribute('href') === '/dashboard')
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
