import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('loginPage')

  return (
    <div className="w-full max-w-md bg-white">
      <div className="card-body items-center text-center p-8 lg:p-12">
        <h2 className="card-title text-3xl font-bold text-teal-600">{t('welcome')}</h2>
        <p className="mt-2 text-teal-600">
          {t('newUser')}{' '}
          <Link href="/register" className="link link-hover text-teal-600">
            {t('createAccount')}
          </Link>
        </p>

        <form className="mt-8 w-full">
          <div className="form-control w-full text-start">
            <label className="label text-gray-500">{t('emailLabel')}</label>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="input input-bordered w-full bg-white border-gray-300 placeholder-gray-500"
            />
          </div>

          <div className="form-control w-full mt-4 text-start">
            <label className="label">
              <span className="label-text text-gray-500">{t('passwordLabel')}.</span>
              <Link href="/forgot-password" passHref>
                <span className="text-teal-600">{t('forgotPassword')}</span>
              </Link>
            </label>
            <input
              type="password"
              className="input input-bordered w-full bg-white border border-gray-300 placeholder-gray-500"
              placeholder="Senha"
            />
          </div>

          <div className="form-control mt-8">
            <button className="btn btn-neutral text-lg bg-[#253936]">{t('loginButton')}</button>
          </div>
        </form>

        <div className="divider mt-8 text-gray-500">{t('socialLogin')}</div>

        <div className="flex gap-4">
          <button className="btn bg-teal-600 text-white border-none">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login com Google
          </button>
        </div>
      </div>
    </div>
  )
}
