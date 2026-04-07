/**
 * @module lost-found
 * @file LostFoundEditForm.tsx
 * @description Form for editing an existing lost or found report (no type or photo change).
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { UpdateLostFoundData } from '@/modules/lost-found/types'

interface LostFoundEditFormValues {
  petName: string
  species: string
  description: string
  addressStreet: string
  addressNumber: string
  addressNeighborhood: string
  addressCep: string
  addressCity: string
  addressState: string
  addressNotes: string
  contactEmail: string
  contactPhone: string
}

interface LostFoundEditFormProps {
  onSubmit: (data: UpdateLostFoundData) => Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<LostFoundEditFormValues>
}

const inputClass = 'w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]'

export default function LostFoundEditForm({ onSubmit, isLoading, defaultValues }: LostFoundEditFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LostFoundEditFormValues>({
    defaultValues: {
      petName: defaultValues?.petName ?? '',
      species: defaultValues?.species ?? '',
      description: defaultValues?.description ?? '',
      addressStreet: defaultValues?.addressStreet ?? '',
      addressNumber: defaultValues?.addressNumber ?? '',
      addressNeighborhood: defaultValues?.addressNeighborhood ?? '',
      addressCep: defaultValues?.addressCep ?? '',
      addressCity: defaultValues?.addressCity ?? '',
      addressState: defaultValues?.addressState ?? '',
      addressNotes: defaultValues?.addressNotes ?? '',
      contactEmail: defaultValues?.contactEmail ?? '',
      contactPhone: defaultValues?.contactPhone ?? '',
    },
  })

  const handleFormSubmit = async (data: LostFoundEditFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        petName: data.petName || null,
        species: data.species || null,
        description: data.description,
        addressStreet: data.addressStreet || null,
        addressNumber: data.addressNumber || null,
        addressNeighborhood: data.addressNeighborhood || null,
        addressCep: data.addressCep || null,
        addressCity: data.addressCity || null,
        addressState: data.addressState || null,
        addressNotes: data.addressNotes || null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao atualizar relatório.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label htmlFor="petName" className="text-sm font-medium text-gray-700">
            Nome do animal (opcional)
          </label>
          <input id="petName" type="text" {...register('petName')} className={inputClass} />
        </div>

        {/* Espécie */}
        <div className="flex flex-col gap-1">
          <label htmlFor="species" className="text-sm font-medium text-gray-700">
            Espécie (opcional)
          </label>
          <select id="species" {...register('species')} className={inputClass}>
            <option value="">Selecione...</option>
            <option value="dog">Cão</option>
            <option value="cat">Gato</option>
            <option value="bird">Ave</option>
            <option value="rabbit">Coelho</option>
            <option value="other">Outro</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { required: 'Descrição é obrigatória' })}
            className={[
              'w-full px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.description ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.description && (
            <p role="alert" className="text-xs text-[--color-danger]">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Endereço */}
        <fieldset className="flex flex-col gap-3 border border-gray-200 rounded-[--radius-md] p-4">
          <legend className="text-sm font-medium text-gray-700 px-1">
            Localização (opcional)
          </legend>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressStreet" className="text-sm text-gray-600">Rua</label>
              <input id="addressStreet" type="text" {...register('addressStreet')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label htmlFor="addressNumber" className="text-sm text-gray-600">Número</label>
              <input id="addressNumber" type="text" {...register('addressNumber')} className={inputClass} />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressNeighborhood" className="text-sm text-gray-600">Bairro</label>
              <input id="addressNeighborhood" type="text" {...register('addressNeighborhood')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label htmlFor="addressCep" className="text-sm text-gray-600">CEP</label>
              <input
                id="addressCep"
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                {...register('addressCep')}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressCity" className="text-sm text-gray-600">Cidade</label>
              <input id="addressCity" type="text" {...register('addressCity')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label htmlFor="addressState" className="text-sm text-gray-600">Estado</label>
              <input
                id="addressState"
                type="text"
                placeholder="SP"
                maxLength={2}
                {...register('addressState')}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="addressNotes" className="text-sm text-gray-600">
              Observações do local
            </label>
            <textarea
              id="addressNotes"
              rows={2}
              placeholder="Ex: próximo ao parque, portão verde..."
              {...register('addressNotes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            />
          </div>
        </fieldset>

        {/* Email de contato */}
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

        {/* Telefone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
            Telefone (opcional)
          </label>
          <input
            id="contactPhone"
            type="tel"
            inputMode="numeric"
            {...register('contactPhone')}
            className={inputClass}
          />
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">
            {apiError}
          </p>
        )}

        <Button type="submit" loading={isLoading}>
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}
