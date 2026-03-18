/**
 * @module auth
 * @file LoginForm.tsx
 * @description Login form component using react-hook-form + zod.
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
  password: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
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
      await login(data)
      navigate(ROUTES.HOME)
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Erro ao fazer login. Tente novamente.')
    }
  }

  return (
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

      {apiError && (
        <p role="alert" className="text-sm text-[--color-danger] text-center">
          {apiError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Entrar
      </Button>

      <p className="text-sm text-center text-gray-600">
        Não tem uma conta?{' '}
        <Link to={ROUTES.REGISTER} className="text-[--color-primary] font-medium hover:underline">
          Cadastrar
        </Link>
      </p>
    </form>
  )
}
