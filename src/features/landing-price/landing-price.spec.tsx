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

  it('renders section title and subtitle', () => {
    const heading = screen.getByRole('heading', { name: /title/i })
    const subtitle = screen.getByText(/subtitle/i)

    expect(heading).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
  })

  it('renders price details correctly', () => {
    expect(screen.getByText('planName')).toBeInTheDocument()
    expect(screen.getByText('priceCurrency')).toBeInTheDocument()
    expect(screen.getByText('price')).toBeInTheDocument()
    expect(screen.getByText('priceSuffix')).toBeInTheDocument()
  })

  it('renders button with correct text', () => {
    const ctaButton = screen.getByRole('button', { name: /cta/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('renders features list obtained via t.raw', () => {
    mockFeatures.forEach((feature) => {
      const featureItem = screen.getByText(feature)
      expect(featureItem).toBeInTheDocument()
    })
  })
})
