/**
 * @module pet-health
 * @file VaccinationForm.tsx
 * @description Form for registering a new vaccination with optional catalog selector.
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import VaccineCatalogSelector from './VaccineCatalogSelector'
import type { CreateVaccinationData, VaccineTemplate } from '@/modules/pet-health/types'

interface VaccinationFormProps {
  onSubmit: (data: CreateVaccinationData) => Promise<void>
  isLoading?: boolean
  catalogTemplates?: VaccineTemplate[]
  catalogLoading?: boolean
}

interface VaccinationFormValues {
  vaccineName: string
  applicationDate: string
  nextDueDate: string
  notes: string
}

export default function VaccinationForm({
  onSubmit,
  isLoading,
  catalogTemplates = [],
  catalogLoading,
}: VaccinationFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VaccinationFormValues>({
    defaultValues: { vaccineName: '', applicationDate: '', nextDueDate: '', notes: '' },
  })

  useEffect(() => {
    if (!selectedTemplateId) return
    const tmpl = catalogTemplates.find((t) => t.id === selectedTemplateId)
    if (tmpl) {
      setValue('vaccineName', tmpl.name)
    }
  }, [selectedTemplateId, catalogTemplates, setValue])

  const handleFormSubmit = async (data: VaccinationFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        templateId: selectedTemplateId || undefined,
        vaccineName: data.vaccineName,
        applicationDate: data.applicationDate,
        nextDueDate: data.nextDueDate || null,
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
        <VaccineCatalogSelector
          templates={catalogTemplates}
          value={selectedTemplateId}
          onChange={setSelectedTemplateId}
          isLoading={catalogLoading}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="vac-name" className="text-sm font-medium text-gray-700">
            Nome da vacina
          </label>
          <input
            id="vac-name"
            type="text"
            {...register('vaccineName', { required: 'Nome da vacina é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.vaccineName ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.vaccineName && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.vaccineName.message}</p>
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
          <label htmlFor="nextDueDate" className="text-sm font-medium text-gray-700">
            Próxima dose (opcional — calculada automaticamente se usar catálogo)
          </label>
          <input
            id="nextDueDate"
            type="date"
            {...register('nextDueDate')}
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
