import { render, screen } from '@testing-library/react'

import { initialState } from '@/features/auth/register/state'

import RegisterPage from './page'

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
  useFormState: jest.fn(() => [initialState, jest.fn()]),
  useFormStatus: jest.fn(() => ({ pending: false })),
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('RegisterPage', () => {
  beforeEach(() => {
    render(<RegisterPage />)
  })

  it('renders name, email and password fields with their labels', () => {
    expect(screen.getByText(/nameLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/namePlaceholder/)).toBeInTheDocument()

    expect(screen.getByText(/emailLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/emailPlaceholder/)).toBeInTheDocument()

    expect(screen.getByText(/passwordLabel/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/passwordPlaceholder/)).toBeInTheDocument()
  })

  it('renders main register button', () => {
    const registerButton = screen.getByRole('button', { name: /registerButton/i })
    expect(registerButton).toBeInTheDocument()
  })
})
