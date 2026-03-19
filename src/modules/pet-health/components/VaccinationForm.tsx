/**
 * @module pet-health
 * @file VaccinationForm.tsx
 * @description Form for registering a new vaccination.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { CreateVaccinationData } from '@/modules/pet-health/types'

interface VaccinationFormProps {
  onSubmit: (data: CreateVaccinationData) => Promise<void>
  isLoading?: boolean
}

interface VaccinationFormValues {
  name: string
  applicationDate: string
  nextDoseDate: string
  notes: string
}

export default function VaccinationForm({ onSubmit, isLoading }: VaccinationFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccinationFormValues>({
    defaultValues: { name: '', applicationDate: '', nextDoseDate: '', notes: '' },
  })

  const handleFormSubmit = async (data: VaccinationFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        name: data.name,
        applicationDate: data.applicationDate,
        nextDoseDate: data.nextDoseDate || null,
        notes: data.notes || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao registrar vacina.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="vac-name" className="text-sm font-medium text-gray-700">
            Nome da vacina
          </label>
          <input
            id="vac-name"
            type="text"
            {...register('name', { required: 'Nome da vacina é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.name ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="applicationDate" className="text-sm font-medium text-gray-700">
            Data de aplicação
          </label>
          <input
            id="applicationDate"
            type="date"
            {...register('applicationDate', { required: 'Data é obrigatória' })}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="nextDoseDate" className="text-sm font-medium text-gray-700">
            Próxima dose (opcional)
          </label>
          <input
            id="nextDoseDate"
            type="date"
            {...register('nextDoseDate')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">{apiError}</p>
        )}

        <Button type="submit" loading={isLoading}>
          Registrar
        </Button>
      </div>
    </form>
  )
}
