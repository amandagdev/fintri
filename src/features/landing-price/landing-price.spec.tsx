import { render, screen } from '@testing-library/react'

import LandingPrice from './landing-price'

const mockFeatures = ['Funcionalidade Mock 1', 'Funcionalidade Mock 2', 'Funcionalidade Mock 3']

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key
    t.raw = (key: string) => {
      if (key === 'features') {
        return mockFeatures
      }
      return undefined
    }
    return t
  },
}))

describe('LandingPrice', () => {
  beforeEach(() => {
    render(<LandingPrice />)
  })

  it('deve renderizar o título e o subtítulo da seção', () => {
    const heading = screen.getByRole('heading', { name: /title/i })
    const subtitle = screen.getByText(/subtitle/i)

    expect(heading).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
  })

  it('deve renderizar os detalhes do preço corretamente', () => {
    expect(screen.getByText('planName')).toBeInTheDocument()
    expect(screen.getByText('priceCurrency')).toBeInTheDocument()
    expect(screen.getByText('price')).toBeInTheDocument()
    expect(screen.getByText('priceSuffix')).toBeInTheDocument()
  })

  it('deve renderizar o botão com o texto correto', () => {
    const ctaButton = screen.getByRole('button', { name: /cta/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('deve renderizar a lista de funcionalidades obtida via t.raw', () => {
    mockFeatures.forEach((feature) => {
      const featureItem = screen.getByText(feature)
      expect(featureItem).toBeInTheDocument()
    })
  })
})
