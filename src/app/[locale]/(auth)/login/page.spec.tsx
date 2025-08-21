import { render, screen } from '@testing-library/react'

import { initialLoginState } from '@/features/auth/login/state'

import LoginPage from './page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  })),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(() => [initialLoginState, jest.fn()]),
  useFormStatus: jest.fn(() => ({ pending: false })),
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

  it('renders email and password fields with their labels', () => {
    expect(screen.getByText(/emailLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/emailPlaceholder/)).toBeInTheDocument()

    expect(screen.getByText(/passwordLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
  })

  it('renders forgot password link with correct href', () => {
    const forgotPasswordLink = screen.getByRole('link', { name: /forgotPassword/i })
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('renders main login button', () => {
    const loginButton = screen.getByRole('button', { name: /loginButton/i })
    expect(loginButton).toBeInTheDocument()
  })
})
