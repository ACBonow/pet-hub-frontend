/**
 * @module auth
 * @file ResetPasswordPage.tsx
 * @description New password form — reads reset token from URL query param.
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Button from '@/shared/components/ui/Button'
import LogoMark from '@/shared/components/ui/LogoMark'
import { ROUTES } from '@/routes/routes.config'
import type { ApiError } from '@/shared/types'

const schema = z
  .object({
    newPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>
type TokenError = 'invalid' | 'expired' | null

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [tokenError, setTokenError] = useState<TokenError>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.AUTH.FORGOT_PASSWORD, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: FormData) => {
    if (!token) return
    setTokenError(null)
    try {
      await resetPassword({ token, newPassword: data.newPassword })
      navigate(`${ROUTES.LOGIN}?resetSuccess=1`)
    } catch (err) {
      const error = err as ApiError
      if (error.code === 'RESET_TOKEN_EXPIRED') {
        setTokenError('expired')
      } else {
        setTokenError('invalid')
      }
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6">
        <div className="mb-4 text-center">
          <Link to={ROUTES.HOME} className="inline-block hover:opacity-80 transition-opacity">
            <LogoMark size={26} />
          </Link>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Redefinir senha</h1>
          <p className="text-sm text-gray-600 mt-1">Escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nova senha
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className={[
                'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                errors.newPassword ? 'border-[--color-danger]' : 'border-gray-300',
              ].join(' ')}
              aria-invalid={!!errors.newPassword}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p role="alert" className="text-xs text-[--color-danger]">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={[
                'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                errors.confirmPassword ? 'border-[--color-danger]' : 'border-gray-300',
              ].join(' ')}
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p role="alert" className="text-xs text-[--color-danger]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {tokenError && (
            <div role="alert" className="text-sm text-center">
              <p className="text-[--color-danger] mb-1">
                {tokenError === 'expired'
                  ? 'Link expirado. Solicite um novo link de redefinição.'
                  : 'Link de redefinição inválido. Solicite um novo link.'}
              </p>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-[--color-primary] font-medium hover:underline"
              >
                Solicitar novo link
              </Link>
            </div>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Redefinir senha
          </Button>

          <p className="text-sm text-center mt-2">
            <Link to={ROUTES.LOGIN} className="text-gray-500 hover:underline">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
