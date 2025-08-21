import { Copy, Download, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface QuoteActionsProps {
  readonly quoteId: string
}

export function QuoteActions({ quoteId }: QuoteActionsProps) {
  const t = useTranslations('quote')

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/quotes/share/${quoteId}`
    await navigator.clipboard.writeText(link)
    alert(t('linkCopied'))
  }

  const handleDownloadPdf = () => {
    console.log(`Download PDF for quote: ${quoteId}`)
  }

  const handleSendEmail = () => {
    console.log(`Send email for quote: ${quoteId}`)
  }

  return (
    <div className="flex gap-2">
      <button className="btn btn-sm btn-outline" onClick={handleCopyLink}>
        <Copy className="h-4 w-4" />
        {t('copyLink')}
      </button>
      <button className="btn btn-sm btn-outline" onClick={handleDownloadPdf}>
        <Download className="h-4 w-4" />
        {t('downloadPdf')}
      </button>
      <button className="btn btn-sm btn-outline" onClick={handleSendEmail}>
        <Mail className="h-4 w-4" />
        {t('sendEmail')}
      </button>
    </div>
  )
}
