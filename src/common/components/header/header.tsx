'use client'

import Link from 'next/link'

import { Menu } from 'lucide-react'

import { useTranslations } from 'next-intl'

import { useAuth } from '@/features/auth/hooks/use-auth'

import UserMenu from '../user-menu/user-menu'

export default function Header() {
  const t = useTranslations('HomePage')
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <div className="navbar bg-white shadow-sm px-4 sm:px-8 lg:px-20">
      <div className="navbar-start">
        <Link href="/" className="text-primary text-center text-4xl font-bold">
          Fintri
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="#como-funciona" className="text-gray-700">
              {t('howItWorks')}
            </Link>
          </li>
          <li>
            <Link href="#preco" className="text-gray-700">
              {t('price')}
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-4">
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login">
                  <button className="btn bg-primary border-none hover:bg-primary-dark text-white font-normal hidden sm:flex">
                    {t('login')}
                  </button>
                </Link>

                <Link href="/register">
                  <button className="btn bg-primary border-none hover:bg-primary-dark text-white font-normal hidden sm:flex">
                    {t('register')}
                  </button>
                </Link>
              </>
            )}
          </>
        )}

        <div className="dropdown dropdown-end lg:hidden">
          <button tabIndex={0} className="btn btn-ghost">
            <Menu className="h-5 w-5" />
          </button>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link href="#como-funciona">{t('howItWorks')}</Link>
            </li>
            <li>
              <Link href="#preco">{t('price')}</Link>
            </li>
            {!isLoading && !isAuthenticated && (
              <>
                <li className="mt-2">
                  <Link href="/login" className="btn bg-primary w-full text-white">
                    {t('login')}
                  </Link>
                </li>
                <li className="mt-2">
                  <Link href="/register" className="btn w-full bg-primary text-white">
                    {t('register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
