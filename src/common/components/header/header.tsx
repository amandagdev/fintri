import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations('HomePage')

  return (
    <div className="navbar bg-white shadow-sm px-4 sm:px-8 lg:px-20">
      <div className="navbar-start">
        <Link href="/" className="text-xl text-[#1b6d71] font-bold">
          <Image src="/images/logo.png" alt="Logo" width={80} height={50} />
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
        <Link href="/login">
          <button className="btn bg-[#1b6d71] border-none hover:bg-teal-600 text-white font-normal hidden sm:flex">
            {t('login')}
          </button>
        </Link>

        <Link href="/register">
          <button className="btn bg-[#1b6d71] border-none hover:bg-teal-600 text-white font-normal hidden sm:flex">
            {t('register')}
          </button>
        </Link>

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
            <li className="mt-2">
              <button className="btn bg-[#1b6d71] w-full">{t('login')}</button>
            </li>
            <li className="mt-2">
              <button className="btn w-full bg-[#1b6d71]">{t('register')}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
