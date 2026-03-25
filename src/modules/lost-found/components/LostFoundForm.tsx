/**
 * @module lost-found
 * @file LostFoundForm.tsx
 * @description Form for creating lost or found reports.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { CreateLostFoundData, LostFoundType } from '@/modules/lost-found/types'

interface LostFoundFormValues {
  type: LostFoundType
  petName: string
  species: string
  description: string
  location: string
  contactEmail: string
  contactPhone: string
}

interface LostFoundFormProps {
  onSubmit: (data: CreateLostFoundData) => Promise<void>
  isLoading?: boolean
}

export default function LostFoundForm({ onSubmit, isLoading }: LostFoundFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LostFoundFormValues>({
    defaultValues: {
      type: 'LOST',
      petName: '',
      species: '',
      description: '',
      location: '',
      contactEmail: '',
      contactPhone: '',
    },
  })

  const handleFormSubmit = async (data: LostFoundFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        type: data.type,
        petName: data.petName || null,
        species: data.species || null,
        description: data.description || null,
        location: data.location || null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao publicar relatório.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          >
            <option value="LOST">Perdido</option>
            <option value="FOUND">Achado</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="petName" className="text-sm font-medium text-gray-700">
            Nome do animal (opcional)
          </label>
          <input
            id="petName"
            type="text"
            {...register('petName')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="species" className="text-sm font-medium text-gray-700">
            Espécie (opcional)
          </label>
          <select
            id="species"
            {...register('species')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          >
            <option value="">Selecione...</option>
            <option value="dog">Cão</option>
            <option value="cat">Gato</option>
            <option value="bird">Ave</option>
            <option value="rabbit">Coelho</option>
            <option value="other">Outro</option>
          </select>
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
          <label htmlFor="location" className="text-sm font-medium text-gray-700">
            Localização
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
            Email de contato
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register('contactEmail', { required: 'Email de contato é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.contactEmail ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.contactEmail && (
            <p role="alert" className="text-xs text-[--color-danger]">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">
            {apiError}
          </p>
        )}

        <Button type="submit" loading={isLoading}>
          Publicar
        </Button>
      </div>
    </form>
  )
}
