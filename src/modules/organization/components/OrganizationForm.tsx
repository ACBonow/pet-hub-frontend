/**
 * @module organization
 * @file OrganizationForm.tsx
 * @description Form for creating and editing organizations. CNPJ is required for COMPANY, optional for NGO.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CnpjInput from '@/shared/components/forms/CnpjInput'
import Button from '@/shared/components/ui/Button'
import type { OrganizationType } from '@/modules/organization/types'

interface OrganizationFormValues {
  name: string
  type: OrganizationType
  cnpj: string
}

interface OrganizationFormProps {
  onSubmit: (data: OrganizationFormValues) => Promise<void>
  initialData?: {
    name?: string
    type?: OrganizationType
    cnpj?: string | null
  }
  isLoading?: boolean
}

export default function OrganizationForm({ onSubmit, initialData, isLoading }: OrganizationFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    mode: 'onBlur',
    defaultValues: {
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'COMPANY',
      cnpj: initialData?.cnpj ?? '',
    },
  })

  const selectedType = watch('type')

  const handleFormSubmit = async (data: OrganizationFormValues) => {
    setApiError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao salvar organização.')
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
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-[--color-danger]">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          >
            <option value="COMPANY">Empresa</option>
            <option value="NGO">ONG</option>
          </select>
        </div>

        <CnpjInput
          name="cnpj"
          control={control}
          label="CNPJ"
          required={selectedType === 'COMPANY'}
        />

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
