import { render, screen } from '@testing-library/react'

import LoginPage from './page'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />)
  })

  it('deve renderizar o título de boas-vindas', () => {
    const heading = screen.getByRole('heading', { name: /welcome/i })
    expect(heading).toBeInTheDocument()
  })

  it('deve renderizar o link para criar conta com o href correto', () => {
    const createAccountLink = screen.getByRole('link', { name: /createAccount/i })
    expect(createAccountLink).toBeInTheDocument()
    expect(createAccountLink).toHaveAttribute('href', '/register')
  })

  it('deve renderizar os campos de e-mail e senha com seus labels', () => {
    expect(screen.getByText(/emailLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/emailPlaceholder/)).toBeInTheDocument()

    expect(screen.getByText(/passwordLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
  })

  it('deve renderizar o link de "esqueceu a senha" com o href correto', () => {
    const forgotPasswordLink = screen.getByRole('link', { name: /forgotPassword/i })
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('deve renderizar o botão principal de login', () => {
    const loginButton = screen.getByRole('button', { name: /loginButton/i })
    expect(loginButton).toBeInTheDocument()
  })

  it('deve renderizar a seção de login social', () => {
    expect(screen.getByText(/socialLogin/i)).toBeInTheDocument()
    const googleButton = screen.getByRole('button', { name: /Login com Google/i })
    expect(googleButton).toBeInTheDocument()
  })
})
