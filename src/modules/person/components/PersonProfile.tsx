/**
 * @module person
 * @file PersonProfile.tsx
 * @description Person profile view/edit component.
 * CPF is displayed formatted and is read-only after registration.
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePerson } from '@/modules/person/hooks/usePerson'
import Button from '@/shared/components/ui/Button'
import { applyCpfMask } from '@/shared/utils/mask'
import type { ApiError } from '@/shared/types'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface PersonProfileProps {
  personId: string
}

export default function PersonProfile({ personId }: PersonProfileProps) {
  const { person, isLoading, getPerson, updatePerson } = usePerson()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    getPerson(personId)
  }, [personId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (person) {
      reset({ name: person.name, phone: person.phone ?? '' })
    }
  }, [person, reset])

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    setSuccessMessage(null)
    try {
      await updatePerson(personId, { name: data.name, phone: data.phone || null })
      setSuccessMessage('Salvo com sucesso!')
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Erro ao salvar.')
    }
  }

  if (isLoading && !person) {
    return <p className="text-gray-500">Carregando...</p>
  }

  if (!person) {
    return <p className="text-[--color-danger]">Dados não encontrados.</p>
  }

  return (
    <>
      {/* Profile header — displays name and CPF as readable text */}
      <div className="mb-6 p-4 bg-white rounded-[--radius-lg] border border-gray-100 shadow-sm">
        <p className="text-lg font-semibold text-gray-900">{person.name}</p>
        <p className="text-sm text-gray-500 mt-1">CPF: {applyCpfMask(person.cpf)}</p>
      </div>

    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          id="name"
          type="text"
          className={[
            'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
            errors.name ? 'border-[--color-danger]' : 'border-gray-300',
          ].join(' ')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-[--color-danger]">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
          CPF
        </label>
        <input
          id="cpf"
          type="text"
          readOnly
          value={applyCpfMask(person.cpf)}
          className="w-full min-h-[44px] px-3 py-2 border border-gray-200 rounded-[--radius-md] text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          aria-label="CPF (não pode ser alterado)"
        />
        <p className="text-xs text-gray-400">O CPF não pode ser alterado após o cadastro.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Telefone (opcional)
        </label>
        <input
          id="phone"
          type="tel"
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          {...register('phone')}
        />
      </div>

      {apiError && (
        <p role="alert" className="text-sm text-[--color-danger]">
          {apiError}
        </p>
      )}

      {successMessage && (
        <p role="status" className="text-sm text-[--color-secondary]">
          {successMessage}
        </p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Salvar
      </Button>
    </form>
    </>
  )
}
