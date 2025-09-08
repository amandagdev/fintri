export const shareToWhatsApp = (title: string, documentId: string) => {
  const message = `Olá! Aqui está seu orçamento: ${title}\n\n${window.location.origin}/template/${documentId}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

export const copyToClipboard = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

export const shareToWhatsAppFromTemplate = (title: string) => {
  const message = `Olá! Aqui está seu orçamento: ${title}\n\n${window.location.href}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

export const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const handleButtonState = (
  button: HTMLButtonElement,
  isLoading: boolean,
  message?: string,
) => {
  if (isLoading) {
    button.disabled = true
    const messageText = message ? ` ${message}` : ''
    button.innerHTML = `<span class="loading loading-spinner loading-sm"></span>${messageText}`
  } else {
    button.disabled = false
    button.innerHTML = button.getAttribute('data-original-content') || ''
  }
}
