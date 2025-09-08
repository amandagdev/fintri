import { downloadFile } from './share-utils'

interface GeneratePDFOptions {
  documentId: string
  fileName: string
  onProgress?: (message: string) => void
  onError?: (error: string) => void
  onSuccess?: () => void
}

export async function generateQuotePDF({
  documentId,
  fileName,
  onProgress,
  onError,
  onSuccess,
}: GeneratePDFOptions): Promise<void> {
  try {
    onProgress?.('Gerando PDF...')

    const templateUrl = `${window.location.origin}/template/${documentId}`

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: templateUrl,
        fileName,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    onProgress?.('Finalizando...')

    const blob = await response.blob()
    downloadFile(blob, fileName)

    onSuccess?.()
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    onError?.('Erro ao gerar PDF. Tente novamente.')
  }
}
