/**
 * @module services-directory
 * @file ServiceForm.tsx
 * @description Form component for creating a service listing.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/shared/components/ui/Button'
import { SERVICE_TYPE_LABELS } from '@/modules/services-directory/types'
import type { ServiceType, CreateServiceData } from '@/modules/services-directory/types'

const SERVICE_TYPES = Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(SERVICE_TYPES as [ServiceType, ...ServiceType[]], {
    errorMap: () => ({ message: 'Selecione um tipo' }),
  }),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface ServiceFormProps {
  onSubmit: (data: CreateServiceData) => Promise<void>
  isLoading: boolean
}

export default function ServiceForm({ onSubmit, isLoading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      type: data.type,
      description: data.description || undefined,
      address: data.address || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
    })
  }

  const inputClass = (hasError: boolean) =>
    [
      'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
      'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
      hasError ? 'border-[--color-danger]' : 'border-gray-300',
    ].join(' ')

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nome <span className="text-[--color-danger]">*</span>
        </label>
        <input
          id="name"
          type="text"
          className={inputClass(!!errors.name)}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-sm font-medium text-gray-700">
          Tipo <span className="text-[--color-danger]">*</span>
        </label>
        <select
          id="type"
          className={inputClass(!!errors.type)}
          aria-invalid={!!errors.type}
          {...register('type')}
        >
          <option value="">Selecione um tipo</option>
          {SERVICE_TYPES.map((t) => (
            <option key={t} value={t}>{SERVICE_TYPE_LABELS[t]}</option>
          ))}
        </select>
        {errors.type && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.type.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          id="description"
          rows={3}
          className={inputClass(false).replace('min-h-[44px]', '')}
          {...register('description')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium text-gray-700">Endereço</label>
        <input
          id="address"
          type="text"
          className={inputClass(false)}
          {...register('address')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefone</label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          className={inputClass(false)}
          {...register('phone')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</label>
        <input
          id="email"
          type="email"
          className={inputClass(!!errors.email)}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="website" className="text-sm font-medium text-gray-700">Website</label>
        <input
          id="website"
          type="url"
          className={inputClass(!!errors.website)}
          aria-invalid={!!errors.website}
          {...register('website')}
        />
        {errors.website && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.website.message}</p>
        )}
      </div>

      <Button type="submit" loading={isLoading} className="w-full mt-2">
        Cadastrar serviço
      </Button>
    </form>
  )
}
