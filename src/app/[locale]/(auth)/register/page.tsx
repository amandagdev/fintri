import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('registerPage')

  return (
    <div className="w-full max-w-md bg-white">
      <div className="card-body items-center text-center p-8 lg:p-12">
        <h2 className="card-title text-3xl font-bold text-teal-600">
          <Link href="/" className="text-xl text-[#1b6d71] font-bold">
            <Image src="/images/logo.png" alt="Logo" width={150} height={50} />
          </Link>{' '}
        </h2>
        <p className="text-[#1b6d71]">
          {t('alreadyUser')}{' '}
          <Link href="/login" className="link link-hover text-[#1b6d71]">
            {t('login')}
          </Link>
        </p>

        <form className="mt-8 w-full">
          <div className="form-control w-full text-start">
            <label className="label text-gray-500">{t('nameLabel')}</label>
            <input
              type="text"
              placeholder={t('namePlaceholder')}
              className="input input-bordered w-full bg-white border-gray-300 placeholder-gray-500"
            />
          </div>

          <div className="form-control w-full text-start mt-4">
            <label className="label text-gray-500">{t('emailLabel')}</label>
            <input
              type="text"
              placeholder={t('emailPlaceholder')}
              className="input input-bordered w-full bg-white border-gray-300 placeholder-gray-500"
            />
          </div>

          <div className="form-control w-full mt-4 text-start">
            <label className="label">
              <span className="label-text text-gray-500">{t('passwordLabel')}</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full bg-white border border-gray-300 placeholder-gray-500"
              placeholder={t('passwordPlaceholder')}
            />
          </div>

          <div className="form-control mt-8">
            <button className="btn border-none text-lg bg-[#1b6d71]">{t('registerButton')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
