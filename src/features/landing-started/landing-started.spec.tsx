import { render, screen } from '@testing-library/react'

import LandingStarted from './landing-started'

const mockFeatures = [
  {
    title: 'Funcionalidade Mock 1',
    description: 'Descrição da funcionalidade mock 1.',
  },
  {
    title: 'Funcionalidade Mock 2',
    description: 'Descrição da funcionalidade mock 2.',
  },
]

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

describe('LandingStarted', () => {
  beforeEach(() => {
    render(<LandingStarted />)
  })

  it('deve renderizar o título principal corretamente', () => {
    const heading = screen.getByRole('heading', { name: /about aboutTwo/i })
    expect(heading).toBeInTheDocument()
  })

  it('deve renderizar a descrição', () => {
    const description = screen.getByText('description')
    expect(description).toBeInTheDocument()
  })

  it('deve renderizar a lista de funcionalidades a partir do mock de t.raw', () => {
    mockFeatures.forEach((feature) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument()
      expect(screen.getByText(feature.description)).toBeInTheDocument()
    })
  })
})
