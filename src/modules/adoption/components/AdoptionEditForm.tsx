/**
 * @module adoption
 * @file AdoptionEditForm.tsx
 * @description Form for editing an existing adoption listing (description and contact info only).
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { UpdateAdoptionData } from '@/modules/adoption/types'

interface AdoptionEditFormValues {
  description: string
  contactEmail: string
  contactPhone: string
  contactWhatsapp: string
}

interface AdoptionEditFormProps {
  onSubmit: (data: UpdateAdoptionData) => Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<AdoptionEditFormValues>
}

export default function AdoptionEditForm({ onSubmit, isLoading, defaultValues }: AdoptionEditFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdoptionEditFormValues>({
    defaultValues: {
      description: defaultValues?.description ?? '',
      contactEmail: defaultValues?.contactEmail ?? '',
      contactPhone: defaultValues?.contactPhone ?? '',
      contactWhatsapp: defaultValues?.contactWhatsapp ?? '',
    },
  })

  const handleFormSubmit = async (data: AdoptionEditFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        description: data.description || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        contactWhatsapp: data.contactWhatsapp || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao atualizar anúncio.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {/* Email de contato */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
            Email de contato
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register('contactEmail', {
              validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido.',
            })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.contactEmail ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.contactEmail && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.contactEmail.message}</p>
          )}
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
            Telefone de contato (opcional)
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register('contactPhone')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contactWhatsapp" className="text-sm font-medium text-gray-700">
            WhatsApp (opcional)
          </label>
          <input
            id="contactWhatsapp"
            type="tel"
            {...register('contactWhatsapp')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">{apiError}</p>
        )}

        <Button type="submit" loading={isLoading}>
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}
