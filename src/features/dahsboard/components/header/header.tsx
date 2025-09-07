import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ListingHeader() {
  const t = useTranslations('dashboard')

  return (
    <div className="bg-white flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-600">{t('title')}</h2>
          <p className="text-gray-500 mt-1">{t('description')}</p>
        </div>
        <Link
          href="/quote/add"
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {t('createQuote')}
        </Link>
      </div>
    </div>
  )
}
