import { fireEvent, render, screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'

import LandingFAQ from './landing-faq'

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>

describe('LandingFAQ', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'faq.title': 'Perguntas Frequentes',
      'faq.subtitle': 'Encontre respostas para as dúvidas mais comuns sobre a Fintri',
      'faq.whatIsFintri.question': 'O que é o Fintri?',
      'faq.whatIsFintri.answer': 'O Fintri é uma plataforma completa de gestão de orçamentos...',
      'faq.howToCreateQuote.question': 'Como criar um orçamento no Fintri?',
      'faq.howToCreateQuote.answer': 'Criar um orçamento no Fintri é muito simples...',
      'faq.clientManagement.question': 'Como funciona o gerenciamento de clientes?',
      'faq.clientManagement.answer':
        'O Fintri oferece um sistema completo de gestão de clientes...',
      'faq.quoteTypes.question': 'Quais tipos de orçamento posso criar?',
      'faq.quoteTypes.answer': 'O Fintri oferece dois tipos de orçamento...',
      'faq.pdfGeneration.question': 'Como funciona a geração de PDF?',
      'faq.pdfGeneration.answer': 'Todos os orçamentos podem ser convertidos em PDF...',
      'faq.sharingQuotes.question': 'Como posso compartilhar meus orçamentos?',
      'faq.sharingQuotes.answer': 'O Fintri oferece múltiplas formas de compartilhamento...',
      'faq.dataSecurity.question': 'Meus dados estão seguros no Fintri?',
      'faq.dataSecurity.answer': 'Sim, a segurança é nossa prioridade...',
      'faq.pricing.question': 'Qual o valor do Fintri?',
      'faq.pricing.answer': 'O Fintri oferece um plano único por R$ 29,00/mês...',
      'faq.support.question': 'Que tipo de suporte vocês oferecem?',
      'faq.support.answer': 'Oferecemos suporte completo através de...',
      'faq.integration.question': 'O Fintri se integra com outras ferramentas?',
      'faq.integration.answer': 'Atualmente, o Fintri funciona como uma solução completa...',
      'faq.stillHaveQuestions': 'Ainda tem dúvidas?',
      'faq.contactUs': 'Entre em Contato',
    }
    return translations[key] || key
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue(mockT)
  })

  it('should render FAQ section', () => {
    render(<LandingFAQ />)

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(8)
  })

  it('should toggle FAQ item when clicked', () => {
    render(<LandingFAQ />)

    const buttons = screen.getAllByRole('button')
    const firstButton = buttons[0]

    expect(firstButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(firstButton)

    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('should render contact section', () => {
    render(<LandingFAQ />)

    const contactButton = screen.getByRole('link', { name: 'contactUs' })
    expect(contactButton).toBeInTheDocument()
  })
})
