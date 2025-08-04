import { render, screen } from '@testing-library/react'

import LandingIntro from './landing-intro'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('LandingIntro', () => {
  beforeEach(() => {
    render(<LandingIntro />)
  })

  it('deve renderizar o título principal corretamente', () => {
    const heading = screen.getByRole('heading', { name: /about budgets/i })
    expect(heading).toBeInTheDocument()
  })

  it('deve renderizar a descrição', () => {
    const description = screen.getByText('description')
    expect(description).toBeInTheDocument()
    expect(description.tagName).toBe('P')
  })

  it('deve renderizar o botão de "Cadastre-se"', () => {
    const registerButton = screen.getByRole('button', { name: /register/i })
    expect(registerButton).toBeInTheDocument()
    expect(registerButton).toHaveClass('btn-outline text-black font-normal mt-8')
  })
})
