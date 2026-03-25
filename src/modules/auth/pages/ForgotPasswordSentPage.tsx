/**
 * @module auth
 * @file ForgotPasswordSentPage.tsx
 * @description Confirmation page after password reset email is sent.
 */

import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'

export default function ForgotPasswordSentPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6 text-center">
        <div className="mb-4">
          <Link to={ROUTES.HOME} className="text-base font-bold text-[--color-primary] hover:opacity-80 transition-opacity">
            PetHUB
          </Link>
        </div>
        <div className="text-5xl mb-4">✉️</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail enviado</h1>

        {email ? (
          <p className="text-sm text-gray-600 mb-1">
            Se <span className="font-semibold text-gray-900">{email}</span> estiver cadastrado,
            você receberá um link para redefinir sua senha.
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-1">
            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
        )}
        <p className="text-xs text-gray-500 mb-6">Verifique também a pasta de spam.</p>

        <div className="flex flex-col gap-3">
          <Link
            to={ROUTES.AUTH.FORGOT_PASSWORD}
            className="text-sm text-[--color-primary] font-medium hover:underline"
          >
            Tentar outro e-mail
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-gray-500 hover:underline"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
