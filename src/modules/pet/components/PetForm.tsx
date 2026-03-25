/**
 * @module pet
 * @file PetForm.tsx
 * @description Form for creating and editing pets.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { TutorshipType } from '@/modules/pet/types'

interface PetFormValues {
  name: string
  species: string
  breed: string
  birthDate: string
  tutorshipType: TutorshipType
}

interface PetFormProps {
  onSubmit: (data: PetFormValues) => Promise<void>
  initialData?: Partial<PetFormValues>
  isLoading?: boolean
}

export default function PetForm({ onSubmit, initialData, isLoading }: PetFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormValues>({
    defaultValues: {
      name: initialData?.name ?? '',
      species: initialData?.species ?? '',
      breed: initialData?.breed ?? '',
      birthDate: initialData?.birthDate ?? '',
      tutorshipType: initialData?.tutorshipType ?? 'OWNER',
    },
  })

  const handleFormSubmit = async (data: PetFormValues) => {
    setApiError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao salvar pet.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2',
              'border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.name ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-[--color-danger]">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="species" className="text-sm font-medium text-gray-700">
            Espécie
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
          <label htmlFor="breed" className="text-sm font-medium text-gray-700">
            Raça
          </label>
          <input
            id="breed"
            type="text"
            {...register('breed')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">
            {apiError}
          </p>
        )}

        <Button type="submit" loading={isLoading}>
          Salvar
        </Button>
      </div>
    </form>
  )
}
