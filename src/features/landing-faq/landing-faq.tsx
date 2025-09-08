'use client'

import { useState } from 'react'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FAQItem {
  question: string
  answer: string
}

export default function LandingFAQ() {
  const t = useTranslations('faq')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const faqItems: FAQItem[] = [
    {
      question: t('whatIsFintri.question'),
      answer: t('whatIsFintri.answer'),
    },
    {
      question: t('clientManagement.question'),
      answer: t('clientManagement.answer'),
    },
    {
      question: t('quoteTypes.question'),
      answer: t('quoteTypes.answer'),
    },
    {
      question: t('pdfGeneration.question'),
      answer: t('pdfGeneration.answer'),
    },
    {
      question: t('sharingQuotes.question'),
      answer: t('sharingQuotes.answer'),
    },
    {
      question: t('pricing.question'),
      answer: t('pricing.answer'),
    },
    {
      question: t('support.question'),
      answer: t('support.answer'),
    },
    {
      question: t('integration.question'),
      answer: t('integration.answer'),
    },
  ]

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={`faq-item-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {index + 1}. {item.question}
                </h3>
                {openItems.has(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {openItems.has(index) && (
                <div id={`faq-answer-${index}`} className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">{t('stillHaveQuestions')}</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1b6d71] hover:bg-[#2cb5a0] transition-colors duration-200"
          >
            {t('contactUs')}
          </a>
        </div>
      </div>
    </section>
  )
}
