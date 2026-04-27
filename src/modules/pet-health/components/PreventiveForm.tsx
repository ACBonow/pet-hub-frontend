/**
 * @module pet-health
 * @file PreventiveForm.tsx
 * @description Form for registering a preventive treatment (flea/tick/dewormer).
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { CreatePreventiveData, VaccineTemplate } from '@/modules/pet-health/types'

interface PreventiveFormProps {
  onSubmit: (data: CreatePreventiveData) => Promise<void>
  isLoading?: boolean
  catalogTemplates?: VaccineTemplate[]
}

interface PreventiveFormValues {
  productName: string
  appliedAt: string
  brand: string
  notes: string
}

const PREVENTIVE_TYPE_LABEL: Record<string, string> = {
  FLEA: 'Antipulgas',
  TICK: 'Carrapaticida',
  FLEA_TICK: 'Antipulgas e Carrapatos',
  DEWORMER: 'Vermífugo',
  HEARTWORM: 'Dirofilária (Verme do Coração)',
  OTHER: 'Outro',
}

export default function PreventiveForm({ onSubmit, isLoading, catalogTemplates = [] }: PreventiveFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PreventiveFormValues>({
    defaultValues: { productName: '', appliedAt: '', brand: '', notes: '' },
  })

  useEffect(() => {
    if (!selectedTemplateId) return
    const tmpl = catalogTemplates.find((t) => t.id === selectedTemplateId)
    if (tmpl) {
      setValue('productName', tmpl.name)
    }
  }, [selectedTemplateId, catalogTemplates, setValue])

  const preventiveTemplates = catalogTemplates.filter((t) => t.type === 'PREVENTIVE')

  const handleFormSubmit = async (data: PreventiveFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        templateId: selectedTemplateId || undefined,
        productName: data.productName,
        appliedAt: data.appliedAt,
        brand: data.brand || undefined,
        notes: data.notes || undefined,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao registrar preventivo.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {preventiveTemplates.length > 0 && (
          <div className="flex flex-col gap-1">
            <label htmlFor="preventive-template" className="text-sm font-medium text-gray-700">
              Tipo de preventivo (opcional)
            </label>
            <select
              id="preventive-template"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            >
              <option value="">— Selecionar tipo —</option>
              {preventiveTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.preventiveType ? PREVENTIVE_TYPE_LABEL[t.preventiveType] ?? t.name : t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="productName" className="text-sm font-medium text-gray-700">
            Produto / Nome
          </label>
          <input
            id="productName"
            type="text"
            placeholder="Ex: Frontline Plus, Bravecto, Drontal Plus"
            {...register('productName', { required: 'Nome do produto é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.productName ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.productName && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.productName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="appliedAt" className="text-sm font-medium text-gray-700">
            Data de aplicação
          </label>
          <input
            id="appliedAt"
            type="date"
            {...register('appliedAt', { required: 'Data é obrigatória' })}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="preventive-brand" className="text-sm font-medium text-gray-700">
            Marca (opcional)
          </label>
          <input
            id="preventive-brand"
            type="text"
            {...register('brand')}
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
