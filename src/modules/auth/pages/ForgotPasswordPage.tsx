/**
 * @module auth
 * @file ForgotPasswordPage.tsx
 * @description Page with email form to request a password reset link.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Button from '@/shared/components/ui/Button'
import { ROUTES } from '@/routes/routes.config'
import type { ApiError } from '@/shared/types'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    try {
      await forgotPassword({ email: data.email })
      navigate(`${ROUTES.AUTH.FORGOT_PASSWORD_SENT}?email=${encodeURIComponent(data.email)}`)
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Erro ao enviar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Esqueci minha senha</h1>
          <p className="text-sm text-gray-600 mt-1">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={[
                'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                errors.email ? 'border-[--color-danger]' : 'border-gray-300',
              ].join(' ')}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p role="alert" className="text-xs text-[--color-danger]">
                {errors.email.message}
              </p>
            )}
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-[--color-danger] text-center">
              {apiError}
            </p>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Enviar link
          </Button>

          <p className="text-sm text-center">
            <Link to={ROUTES.LOGIN} className="text-gray-500 hover:underline">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
