'use client'

import { useActionState, useEffect } from 'react'

import { useFormStatus } from 'react-dom'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useTranslations } from 'next-intl'

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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/connect/google`
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            {/* <Image src="/images/logo.png" alt="Fintri Logo" width={80} height={80} /> */}
            <h1 className="text-primary text-center text-4xl font-bold">Fintri</h1>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {t('title')}
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-6">
          <form action={formAction} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('emailLabel')}</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={t('emailPlaceholder')}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('passwordLabel')}</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder={t('passwordLabel')}
                className="input input-bordered w-full"
                required
              />
              <div className="label">
                <span></span>
                <span className="label-text-alt">
                  <Link href="/forgot-password" className="link link-hover text-primary text-right">
                    {t('forgotPassword')}
                  </Link>
                </span>
              </div>
            </div>

            {state?.message && (
              <div className="alert alert-error">
                <span>{t(state.message as never)}</span>
              </div>
            )}

            <div className="form-control">
              <button type="submit" disabled={pending} className="btn btn-primary w-full">
                {pending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {t('loginButtonLoading')}
                  </>
                ) : (
                  t('loginButton')
                )}
              </button>
            </div>
          </form>

          <div className="divider">{t('continueWith')}</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full"
            disabled
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('continueWithGoogle')}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {t('noAccount')}{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
                {t('registerHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
