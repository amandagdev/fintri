'use client'

import { usePathname, useRouter } from 'next/navigation'

export function useClientForm() {
  const router = useRouter()
  const pathname = usePathname()

  const locale = pathname.split('/')[1] || 'pt'

  const handleSuccess = () => {
    router.push(`/${locale}/clients`)
  }

  return {
    handleSuccess,
  }
}
