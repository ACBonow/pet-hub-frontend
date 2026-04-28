/**
 * @module organization
 * @file OrganizationForm.tsx
 * @description Form for creating and editing organizations. CNPJ is required for COMPANY, optional for NGO.
 *              responsiblePersonId is derived from JWT by the backend — not required in the form.
 */

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import CnpjInput from '@/shared/components/forms/CnpjInput'
import Button from '@/shared/components/ui/Button'
import type { OrganizationType } from '@/modules/organization/types'

interface OrganizationFormValues {
  name: string
  type: OrganizationType
  cnpj: string
  phone: string
  email: string
  website: string
  instagram: string
  description: string
  addressStreet: string
  addressNumber: string
  addressNeighborhood: string
  addressCep: string
  addressCity: string
  addressState: string
}

export interface OrganizationFormSubmitData {
  name: string
  type: OrganizationType
  cnpj: string
  phone: string | null
  email: string | null
  website: string | null
  instagram: string | null
  description: string | null
  addressStreet: string | null
  addressNumber: string | null
  addressNeighborhood: string | null
  addressCep: string | null
  addressCity: string | null
  addressState: string | null
  photoFile?: File | null
}

interface OrganizationFormProps {
  onSubmit: (data: OrganizationFormSubmitData) => Promise<void>
  initialData?: {
    name?: string
    type?: OrganizationType
    cnpj?: string | null
    phone?: string | null
    email?: string | null
    website?: string | null
    instagram?: string | null
    description?: string | null
    addressStreet?: string | null
    addressNumber?: string | null
    addressNeighborhood?: string | null
    addressCep?: string | null
    addressCity?: string | null
    addressState?: string | null
  }
  isLoading?: boolean
  submitLabel?: string
}

const inputClass = 'w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]'
const labelClass = 'text-sm font-medium text-gray-700'
const labelOptClass = 'text-sm text-gray-600'

export default function OrganizationForm({ onSubmit, initialData, isLoading, submitLabel }: OrganizationFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoFileRef = useRef<File | null>(null)

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
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      website: initialData?.website ?? '',
      instagram: initialData?.instagram ?? '',
      description: initialData?.description ?? '',
      addressStreet: initialData?.addressStreet ?? '',
      addressNumber: initialData?.addressNumber ?? '',
      addressNeighborhood: initialData?.addressNeighborhood ?? '',
      addressCep: initialData?.addressCep ?? '',
      addressCity: initialData?.addressCity ?? '',
      addressState: initialData?.addressState ?? '',
    },
  })

  const selectedType = watch('type')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    photoFileRef.current = file
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleFormSubmit = async (data: OrganizationFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        name: data.name,
        type: data.type,
        cnpj: data.cnpj,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        instagram: data.instagram || null,
        description: data.description || null,
        addressStreet: data.addressStreet || null,
        addressNumber: data.addressNumber || null,
        addressNeighborhood: data.addressNeighborhood || null,
        addressCep: data.addressCep || null,
        addressCity: data.addressCity || null,
        addressState: data.addressState || null,
        photoFile: photoFileRef.current,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao salvar organização.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className={labelClass}>Nome</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.name ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.name.message}</p>
          )}
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className={labelClass}>Tipo</label>
          <select
            id="type"
            {...register('type')}
            className={inputClass}
          >
            <option value="COMPANY">Empresa</option>
            <option value="NGO">ONG</option>
          </select>
        </div>

        {/* CNPJ */}
        <CnpjInput
          name="cnpj"
          control={control}
          label="CNPJ"
          required={selectedType === 'COMPANY'}
        />

        {/* Telefone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClass}>Telefone</label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            {...register('phone')}
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClass}>E-mail</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              validate: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
            })}
            className={[
              'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
              errors.email ? 'border-[--color-danger]' : 'border-gray-300',
            ].join(' ')}
          />
          {errors.email && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.email.message}</p>
          )}
        </div>

        {/* Site */}
        <div className="flex flex-col gap-1">
          <label htmlFor="website" className={labelOptClass}>Site (opcional)</label>
          <input
            id="website"
            type="url"
            placeholder="https://..."
            {...register('website')}
            className={inputClass}
          />
        </div>

        {/* Instagram */}
        <div className="flex flex-col gap-1">
          <label htmlFor="instagram" className={labelOptClass}>Instagram (opcional)</label>
          <input
            id="instagram"
            type="text"
            placeholder="@usuario"
            {...register('instagram')}
            className={inputClass}
          />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className={labelOptClass}>Sobre a organização (opcional)</label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
        </div>

        {/* Endereço */}
        <fieldset className="flex flex-col gap-3 border border-gray-200 rounded-[--radius-md] p-4">
          <legend className={`${labelOptClass} px-1`}>Endereço (opcional)</legend>

          {/* Rua + Número */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressStreet" className={labelOptClass}>Rua</label>
              <input id="addressStreet" type="text" {...register('addressStreet')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label htmlFor="addressNumber" className={labelOptClass}>Número</label>
              <input id="addressNumber" type="text" {...register('addressNumber')} className={inputClass} />
            </div>
          </div>

          {/* Bairro + CEP */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressNeighborhood" className={labelOptClass}>Bairro</label>
              <input id="addressNeighborhood" type="text" {...register('addressNeighborhood')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label htmlFor="addressCep" className={labelOptClass}>CEP</label>
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

          {/* Cidade + Estado */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressCity" className={labelOptClass}>Cidade</label>
              <input id="addressCity" type="text" {...register('addressCity')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label htmlFor="addressState" className={labelOptClass}>Estado</label>
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
        </fieldset>

        {/* Foto */}
        <div className="flex flex-col gap-1">
          <label htmlFor="photoFile" className={labelOptClass}>Foto (opcional)</label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="preview"
              className="w-20 h-20 rounded-full object-cover mb-1"
            />
          )}
          <input
            id="photoFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="text-sm text-gray-600"
          />
        </div>

        {apiError && (
          <p role="alert" className="text-sm text-[--color-danger]">{apiError}</p>
        )}

        <Button type="submit" loading={isLoading}>{submitLabel ?? 'Salvar'}</Button>
      </div>
    </form>
  )
}
