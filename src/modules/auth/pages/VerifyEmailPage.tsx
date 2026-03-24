/**
 * @module auth
 * @file VerifyEmailPage.tsx
 * @description Processes email verification token from URL query param.
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ROUTES } from '@/routes/routes.config'
import type { ApiError } from '@/shared/types'

type State = 'loading' | 'success' | 'invalid' | 'expired'

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.AUTH.CHECK_EMAIL, { replace: true })
      return
    }

    verifyEmail({ token })
      .then(() => setState('success'))
      .catch((err: ApiError) => {
        if (err.code === 'VERIFICATION_TOKEN_EXPIRED') {
          setState('expired')
        } else {
          setState('invalid')
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          role="status"
          aria-label="Verificando..."
          className="animate-spin w-10 h-10 border-4 border-[--color-primary] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail verificado com sucesso!</h1>
          <p className="text-sm text-gray-600 mb-6">Você já pode entrar na sua conta.</p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-block px-6 py-3 bg-[--color-primary] text-white rounded-[--radius-md] font-medium hover:opacity-90"
          >
            Entrar agora
          </Link>
        </div>
      </div>
    )
  }

  const errorMessage =
    state === 'expired'
      ? 'Link expirado. Solicite um novo link de verificação.'
      : 'Link de verificação inválido. Solicite um novo link.'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Verificação falhou</h1>
        <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
        <Link
          to={ROUTES.AUTH.CHECK_EMAIL}
          className="text-sm text-[--color-primary] font-medium hover:underline"
        >
          Solicitar novo link
        </Link>
      </div>
    </div>
  )
}
