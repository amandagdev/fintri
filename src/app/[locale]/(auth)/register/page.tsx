'use client'

import { useActionState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { registerUser } from '@/features/auth/register/actions'
import { SubmitButton } from '@/features/auth/register/components/submit-button'
import { initialState } from '@/features/auth/register/state'

export default function RegisterPage() {
  const t = useTranslations('registerPage')
  const [state, formAction] = useActionState(registerUser, initialState)
  const router = useRouter()

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
            <Image src="/images/logo.png" alt="Logo" width={80} height={64} />
          </Link>
        </h2>
        <p className="text-[#1b6d71]">
          {t('alreadyUser')}{' '}
          <Link href="/login" className="link link-hover text-[#1b6d71]">
            {t('login')}
          </Link>
        </p>

        <form action={formAction} className="mt-8 w-full">
          <div className="form-control w-full text-start">
            <label className="label">{t('nameLabel')}</label>
            <input
              type="text"
              name="username"
              placeholder={t('namePlaceholder')}
              className="input input-bordered w-full"
            />
            {state?.errors?.username && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.username)}</p>
            )}
          </div>

          <div className="form-control w-full text-start mt-4">
            <label className="label ">{t('emailLabel')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="input input-bordered w-full"
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.email)}</p>
            )}
          </div>

          <div className="form-control w-full mt-4 text-start">
            <label className="label">
              <span className="label-text text-gray-500">{t('passwordLabel')}</span>
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              placeholder={t('passwordPlaceholder')}
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.password)}</p>
            )}
          </div>

          {state?.message && <p className="text-red-500 mt-4">{t(state.message as never)}</p>}

          <div className="form-control mt-8">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}
