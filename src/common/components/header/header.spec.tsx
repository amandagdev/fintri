import { render, screen } from '@testing-library/react'

import Header from './header'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: unknown) => key,
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Header', () => {
  it('renders logo with link to home page', () => {
    render(<Header />)
    const logoLink = screen.getByRole('link', { name: /logo/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  const getVisibleElement = (role: string, name: string | RegExp) => {
    const elements = screen.getAllByRole(role, { name })
    const visibleElements = elements.filter((element) => {
      const computedStyle = window.getComputedStyle(element)
      return computedStyle.display !== 'none'
    })
    return visibleElements[0]
  }

  it('renders "Como Funciona" link for desktop', () => {
    render(<Header />)
    const howItWorksLink = getVisibleElement('link', 'howItWorks')
    expect(howItWorksLink).toBeInTheDocument()
    expect(howItWorksLink).toHaveAttribute('href', '#como-funciona')
  })

  it('renders "Preço" link for desktop', () => {
    render(<Header />)
    const priceLink = getVisibleElement('link', 'price')
    expect(priceLink).toBeInTheDocument()
    expect(priceLink).toHaveAttribute('href', '#preco')
  })

  it('renders "Cadastre-se" button for desktop', () => {
    render(<Header />)
    const registerButton = getVisibleElement('button', 'register')
    expect(registerButton).toBeInTheDocument()
  })
})
