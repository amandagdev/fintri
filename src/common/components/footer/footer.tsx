import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer footer-center p-10 bg-white text-gray-700 border-t border-gray-200">
      <aside>
        <p>
          Copyright © {currentYear} Fintri - {t('copyright')}
        </p>

        <p>
          <a href={`mailto:${t('email')}`} className="link link-hover ml-1">
            {t('email')}
          </a>
        </p>
      </aside>
    </footer>
  )
}
