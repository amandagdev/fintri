import { render, screen } from '@testing-library/react'

import Header from './header'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: unknown) => key,
}))

jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Header', () => {
  it('deve renderizar o logo com o link para a página inicial', () => {
    render(<Header />)
    const logoLink = screen.getByRole('link', { name: /fintri/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('deve renderizar o link "Como Funciona"', () => {
    render(<Header />)
    const howItWorksLink = screen.getByRole('link', { name: /howItWorks/i })
    expect(howItWorksLink).toBeInTheDocument()
    expect(howItWorksLink).toHaveAttribute('href', '#como-funciona')
  })

  it('deve renderizar o link "Preço"', () => {
    render(<Header />)
    const priceLink = screen.getByRole('link', { name: /price/i })
    expect(priceLink).toBeInTheDocument()
    expect(priceLink).toHaveAttribute('href', '#preco')
  })

  it('deve renderizar o botão de "Cadastre-se"', () => {
    render(<Header />)
    const registerButton = screen.getByRole('button', { name: /register/i })
    expect(registerButton).toBeInTheDocument()
  })
})
