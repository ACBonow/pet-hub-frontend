/**
 * @module adoption
 * @file AdoptionForm.tsx
 * @description Form for creating adoption listings.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { CreateAdoptionData } from '@/modules/adoption/types'

interface AdoptionFormValues {
  petId: string
  description: string
  contactEmail: string
  contactPhone: string
}

interface AdoptionFormProps {
  onSubmit: (data: CreateAdoptionData) => Promise<void>
  isLoading?: boolean
}

export default function AdoptionForm({ onSubmit, isLoading }: AdoptionFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdoptionFormValues>({
    defaultValues: { petId: '', description: '', contactEmail: '', contactPhone: '' },
  })

  const handleFormSubmit = async (data: AdoptionFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        petId: data.petId,
        description: data.description || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao criar anúncio.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="petId" className="text-sm font-medium text-gray-700">
            ID do Pet
          </label>
          <input
            id="petId"
            type="text"
            {...register('petId', { required: 'ID do pet é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.petId ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.petId && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.petId.message}</p>
          )}
        </div>

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

        <div className="flex flex-col gap-1">
          <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
            Email de contato
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register('contactEmail')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

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

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">{apiError}</p>
        )}

        <Button type="submit" loading={isLoading}>
          Publicar anúncio
        </Button>
      </div>
    </form>
  )
}
