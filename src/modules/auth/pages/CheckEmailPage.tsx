/**
 * @module auth
 * @file CheckEmailPage.tsx
 * @description Page shown after registration or verification resend request.
 */

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Button from '@/shared/components/ui/Button'
import { ROUTES } from '@/routes/routes.config'
import type { ApiError } from '@/shared/types'

const COOLDOWN_SECONDS = 60

export default function CheckEmailPage() {
  const { resendVerification } = useAuth()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleResend = async () => {
    setSending(true)
    setFeedback(null)
    try {
      if (!email) {
        setFeedback({ type: 'error', message: 'E-mail não encontrado na URL. Volte e tente novamente.' })
        setSending(false)
        return
      }
      await resendVerification({ email })
      setFeedback({ type: 'success', message: 'E-mail reenviado! Verifique sua caixa de entrada.' })
      setCooldown(COOLDOWN_SECONDS)
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      const error = err as ApiError
      setFeedback({ type: 'error', message: error.message ?? 'Erro ao reenviar. Tente novamente.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6 text-center">
        <div className="mb-4">
          <Link to={ROUTES.HOME} className="text-base font-bold text-[--color-primary] hover:opacity-80 transition-opacity">
            PetHUB
          </Link>
        </div>
        <div className="text-5xl mb-4">✉️</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu e-mail</h1>

        <p className="text-sm text-gray-600 mb-1">
          Enviamos um link de confirmação para
        </p>
        {email ? (
          <p className="text-sm font-semibold text-gray-900 mb-4">{email}</p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">o seu endereço de e-mail.</p>
        )}
        <p className="text-xs text-gray-500 mb-6">
          Verifique também a pasta de spam.
        </p>

        {feedback && (
          <p
            role="alert"
            className={`text-sm mb-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-[--color-danger]'}`}
          >
            {feedback.message}
          </p>
        )}

        <Button
          type="button"
          onClick={handleResend}
          loading={sending}
          disabled={cooldown > 0 || sending}
          className="w-full mb-4"
        >
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar e-mail'}
        </Button>

        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-[--color-primary] font-medium hover:underline"
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
