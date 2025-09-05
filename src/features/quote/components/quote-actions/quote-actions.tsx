import { Copy, Download, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface QuoteActionsProps {
  readonly quoteId: string
}

export function QuoteActions({ quoteId }: QuoteActionsProps) {
  const t = useTranslations('quote')

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/quotes/share/${quoteId}`
      await navigator.clipboard.writeText(link)
      toast.success(t('linkCopied'))
    } catch {
      toast.error(t('copyError'))
    }
  }

  const handleDownloadPdf = () => {
    // TODO: Implementar geração de PDF
    toast.info(t('pdfInDevelopment'))
  }

  const handleSendEmail = () => {
    // TODO: Implementar envio de e-mail
    toast.info(t('emailInDevelopment'))
  }

  return (
    <div className="flex gap-2">
      <button className="btn btn-sm bg-[#1b6d71] text-white" onClick={handleCopyLink}>
        <Copy className="h-4 w-4" />
        {t('copyLink')}
      </button>
      <button className="btn btn-sm bg-[#1b6d71] text-white" onClick={handleDownloadPdf}>
        <Download className="h-4 w-4" />
        {t('downloadPdf')}
      </button>
      <button className="btn btn-sm bg-[#1b6d71] text-white" onClick={handleSendEmail}>
        <Mail className="h-4 w-4" />
        {t('sendEmail')}
      </button>
    </div>
  )
}
