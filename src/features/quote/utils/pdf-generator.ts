import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface GeneratePDFOptions {
  element: HTMLElement
  fileName: string
  onProgress?: (message: string) => void
  onError?: (error: string) => void
  onSuccess?: () => void
}

export async function generateQuotePDF({
  element,
  fileName,
  onProgress,
  onError,
  onSuccess,
}: GeneratePDFOptions): Promise<void> {
  try {
    onProgress?.('Gerando PDF...')

    // Capturar o template como canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Maior qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    onProgress?.('Criando documento...')

    // Criar PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Calcular dimensões para ajustar ao A4
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Adicionar páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    onProgress?.('Finalizando...')

    // Download do PDF
    pdf.save(fileName)

    onSuccess?.()
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    onError?.('Erro ao gerar PDF. Tente novamente.')
  }
}
