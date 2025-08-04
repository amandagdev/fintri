import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations('HomePage')

  return (
    <div className="navbar bg-white shadow-sm px-20">
      <div className="flex-1">
        <Link href="/" className="text-xl text-[#0d363c] font-bold">
          Fintri
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className="items-center">
            <Link href="#como-funciona" className="text-gray-700">
              {t('howItWorks')}
            </Link>
          </li>
          <li className="items-center">
            <Link href="#preco" className="text-gray-700">
              {t('price')}
            </Link>
          </li>
        </ul>
        <button className="btn bg-[#253936] hover:bg-transparent text-white font-normal">
          {t('register')}
        </button>
      </div>
    </div>
  )
}
