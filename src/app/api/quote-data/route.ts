import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getCompanyData, getCurrentUser } from '@/features/account/services/user-service'

export async function GET(_request: NextRequest) {
  try {
    const [company, user] = await Promise.all([getCompanyData(), getCurrentUser()])

    return NextResponse.json({
      company,
      user,
    })
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}
