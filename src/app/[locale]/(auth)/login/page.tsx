'use client'

import { useActionState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'

import { loginUser } from '@/features/auth/login/actions'
import { initialLoginState } from '@/features/auth/login/state'

export default function LoginPage() {
  const t = useTranslations('loginPage')
  const router = useRouter()
  const [state, formAction] = useActionState(loginUser, initialLoginState)
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard')
    }
  }, [state.success, router])

  return (
    <div className="w-full max-w-md bg-white">
      <div className="card-body items-center text-center p-8 lg:p-12">
        <h2 className="card-title text-3xl font-bold text-teal-600">
          <Link href="/" className="text-xl text-[#1b6d71] font-bold">
            <Image src="/images/logo.png" alt="Logo" width={80} height={100} />
          </Link>
        </h2>
        <p className="text-[#1b6d71]">
          {t('newUser')}{' '}
          <Link href="/register" className="link link-hover text-[#1b6d71]">
            {t('createAccount')}
          </Link>
        </p>

        <form action={formAction} className="mt-8 w-full">
          <div className="form-control w-full text-start">
            <label className="label">{t('emailLabel')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="input input-bordered  w-full"
            />
          </div>

          <div className="form-control w-full mt-4 text-start">
            <label className="label">
              <span className="label-text text-gray-500">{t('passwordLabel')}</span>
              <Link href="/forgot-password">
                <span className="text-[#1b6d71]">{t('forgotPassword')}</span>
              </Link>
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              placeholder="Senha"
            />
          </div>

          {state?.message && <p className="text-red-500 mt-4">{t(state.message as never)}</p>}

          <div className="form-control mt-8">
            <button className="btn border-none text-lg bg-[#1b6d71] text-white" disabled={pending}>
              {t('loginButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
