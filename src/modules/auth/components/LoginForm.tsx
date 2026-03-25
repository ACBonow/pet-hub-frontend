/**
 * @module auth
 * @file LoginForm.tsx
 * @description Login form component using react-hook-form + zod.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Button from '@/shared/components/ui/Button'
import { ROUTES } from '@/routes/routes.config'
import type { ApiError } from '@/shared/types'

type LoginError = { type: 'generic'; message: string } | { type: 'unverified'; email: string }

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loginError, setLoginError] = useState<LoginError | null>(null)
  const resetSuccess = searchParams.get('resetSuccess') === '1'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoginError(null)
    try {
      await login(data)
      const returnTo = searchParams.get('returnTo')
      navigate(returnTo ?? ROUTES.DASHBOARD)
    } catch (err) {
      const error = err as ApiError
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        setLoginError({ type: 'unverified', email: data.email })
      } else {
        setLoginError({ type: 'generic', message: error.message ?? 'Erro ao fazer login. Tente novamente.' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {resetSuccess && (
        <div role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-[--radius-md] px-3 py-2 text-center">
          Senha redefinida com sucesso. Faça login.
        </div>
      )}
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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={[
            'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
            errors.password ? 'border-[--color-danger]' : 'border-gray-300',
          ].join(' ')}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p role="alert" className="text-xs text-[--color-danger]">
            {errors.password.message}
          </p>
        )}
      </div>

      {loginError?.type === 'generic' && (
        <p role="alert" className="text-sm text-[--color-danger] text-center">
          {loginError.message}
        </p>
      )}

      {loginError?.type === 'unverified' && (
        <div role="alert" className="text-sm text-center">
          <p className="text-[--color-danger] mb-1">Seu e-mail ainda não foi confirmado.</p>
          <Link
            to={`${ROUTES.AUTH.CHECK_EMAIL}?email=${encodeURIComponent(loginError.email)}`}
            className="text-[--color-primary] font-medium hover:underline"
          >
            Reenviar e-mail de verificação
          </Link>
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Entrar
      </Button>

      <p className="text-sm text-right">
        <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-xs text-gray-500 hover:underline">
          Esqueci minha senha
        </Link>
      </p>

      <p className="text-sm text-center text-gray-600">
        Não tem uma conta?{' '}
        <Link to={ROUTES.REGISTER} className="text-[--color-primary] font-medium hover:underline">
          Cadastrar
        </Link>
      </p>
    </form>
  )
}
