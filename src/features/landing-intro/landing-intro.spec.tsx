import { render, screen } from '@testing-library/react'

import LandingIntro from './landing-intro'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('LandingIntro', () => {
  beforeEach(() => {
    render(<LandingIntro />)
  })

  it('renders main title correctly', () => {
    const heading = screen.getByRole('heading', { name: /about budgets/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders description', () => {
    const description = screen.getByText('description')
    expect(description).toBeInTheDocument()
    expect(description.tagName).toBe('P')
  })

  it('renders "Cadastre-se" button', () => {
    const registerButton = screen.getByRole('button', { name: /register/i })
    expect(registerButton).toBeInTheDocument()
  })
})
