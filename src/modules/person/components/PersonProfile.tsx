/**
 * @module person
 * @file PersonProfile.tsx
 * @description Person profile view/edit component.
 * Shows a creation form for new users, or edit form for existing profiles.
 * CPF is displayed formatted and is read-only after initial registration.
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePerson } from '@/modules/person/hooks/usePerson'
import CpfInput from '@/shared/components/forms/CpfInput'
import Button from '@/shared/components/ui/Button'
import { applyCpfMask } from '@/shared/utils/mask'
import { validateCpf } from '@/shared/validators/cpf.validator'
import type { ApiError } from '@/shared/types'

// ── Edit form ────────────────────────────────────────────────────────────────

const editSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
})
type EditFormData = z.infer<typeof editSchema>

// ── Create form ──────────────────────────────────────────────────────────────

const createSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().refine(validateCpf, { message: 'CPF inválido' }),
  phone: z.string().optional(),
})
type CreateFormData = z.infer<typeof createSchema>

// ── Component ────────────────────────────────────────────────────────────────

export default function PersonProfile() {
  const { person, isLoading, getMe, createPerson, updatePerson } = usePerson()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm<EditFormData>({ resolver: zodResolver(editSchema) })

  const {
    register: createRegister,
    handleSubmit: createHandleSubmit,
    control,
    formState: { errors: createErrors, isSubmitting: isCreating },
  } = useForm<CreateFormData>({ resolver: zodResolver(createSchema) })

  useEffect(() => {
    getMe().catch(() => {/* no profile yet — creation form will show */})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (person) {
      editReset({ name: person.name, phone: person.phone ?? '' })
    }
  }, [person, editReset])

  const onEdit = async (data: EditFormData) => {
    if (!person) return
    setApiError(null)
    setSuccessMessage(null)
    try {
      await updatePerson(person.id, { name: data.name, phone: data.phone || null })
      setSuccessMessage('Salvo com sucesso!')
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Erro ao salvar.')
    }
  }

  const onCreate = async (data: CreateFormData) => {
    setApiError(null)
    try {
      await createPerson({ name: data.name, cpf: data.cpf, phone: data.phone || undefined })
    } catch (err) {
      const error = err as ApiError
      setApiError(error.message ?? 'Erro ao criar perfil.')
    }
  }

  if (isLoading && !person) {
    return <p className="text-gray-500">Carregando...</p>
  }

  // ── New user: profile creation form ──────────────────────────────────────

  if (!person) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Para continuar, complete seu perfil com nome e CPF.
        </p>

        <form onSubmit={createHandleSubmit(onCreate)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="create-name" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="create-name"
              type="text"
              {...createRegister('name')}
              className={[
                'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                createErrors.name ? 'border-[--color-danger]' : 'border-gray-300',
              ].join(' ')}
            />
            {createErrors.name && (
              <p role="alert" className="text-xs text-[--color-danger]">
                {createErrors.name.message}
              </p>
            )}
          </div>

          <CpfInput name="cpf" control={control} label="CPF" required />

          <div className="flex flex-col gap-1">
            <label htmlFor="create-phone" className="text-sm font-medium text-gray-700">
              Telefone (opcional)
            </label>
            <input
              id="create-phone"
              type="tel"
              {...createRegister('phone')}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            />
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-[--color-danger]">
              {apiError}
            </p>
          )}

          <Button type="submit" loading={isCreating}>
            Completar Perfil
          </Button>
        </form>
      </div>
    )
  }

  // ── Existing user: profile edit form ─────────────────────────────────────

  return (
    <>
      <div className="mb-6 p-4 bg-white rounded-[--radius-lg] border border-gray-100 shadow-sm">
        <p className="text-lg font-semibold text-gray-900">{person.name}</p>
        <p className="text-sm text-gray-500 mt-1">CPF: {applyCpfMask(person.cpf)}</p>
      </div>

      <form onSubmit={editHandleSubmit(onEdit)} noValidate className="flex flex-col gap-4">
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
              editErrors.name ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
            aria-invalid={!!editErrors.name}
            {...editRegister('name')}
          />
          {editErrors.name && (
            <p role="alert" className="text-xs text-[--color-danger]">
              {editErrors.name.message}
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
            {...editRegister('phone')}
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

        <Button type="submit" loading={isEditing}>
          Salvar
        </Button>
      </form>
    </>
  )
}
