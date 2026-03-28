/**
 * @module services-directory
 * @file ServiceForm.tsx
 * @description Form component for creating/editing a service listing.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/shared/components/ui/Button'
import type { ServiceTypeRecord, CreateServiceData } from '@/modules/services-directory/types'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.string().min(1, 'Selecione um tipo'),
  description: z.string().optional(),
  // address
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2, 'Use a sigla do estado (ex: SP)').optional(),
  // contact
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  // online
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  googleMapsUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  googleBusinessUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface ServiceFormProps {
  onSubmit: (data: CreateServiceData) => Promise<void>
  isLoading: boolean
  serviceTypes: ServiceTypeRecord[]
}

export default function ServiceForm({ onSubmit, isLoading, serviceTypes }: ServiceFormProps) {
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
      zipCode: data.zipCode || undefined,
      street: data.street || undefined,
      number: data.number || undefined,
      complement: data.complement || undefined,
      neighborhood: data.neighborhood || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      phone: data.phone || undefined,
      whatsapp: data.whatsapp || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
      instagram: data.instagram || undefined,
      facebook: data.facebook || undefined,
      tiktok: data.tiktok || undefined,
      youtube: data.youtube || undefined,
      googleMapsUrl: data.googleMapsUrl || undefined,
      googleBusinessUrl: data.googleBusinessUrl || undefined,
    })
  }

  const inputClass = (hasError: boolean) =>
    [
      'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
      'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
      hasError ? 'border-[--color-danger]' : 'border-gray-300',
    ].join(' ')

  const sectionTitle = (title: string) => (
    <p className="text-sm font-semibold text-gray-700 mt-2">{title}</p>
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
      {sectionTitle('Informações básicas')}

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
          defaultValue=""
          {...register('type')}
        >
          <option value="" disabled>Selecione um tipo</option>
          {serviceTypes.map((t) => (
            <option key={t.code} value={t.code}>{t.label}</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          {...register('description')}
        />
      </div>

      {sectionTitle('Endereço')}

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-32">
          <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">CEP</label>
          <input
            id="zipCode"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            className={inputClass(false)}
            {...register('zipCode')}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="street" className="text-sm font-medium text-gray-700">Logradouro</label>
          <input
            id="street"
            type="text"
            className={inputClass(false)}
            {...register('street')}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-24">
          <label htmlFor="number" className="text-sm font-medium text-gray-700">Número</label>
          <input
            id="number"
            type="text"
            className={inputClass(false)}
            {...register('number')}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="complement" className="text-sm font-medium text-gray-700">Complemento</label>
          <input
            id="complement"
            type="text"
            placeholder="Sala, andar..."
            className={inputClass(false)}
            {...register('complement')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">Bairro</label>
        <input
          id="neighborhood"
          type="text"
          className={inputClass(false)}
          {...register('neighborhood')}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">Cidade</label>
          <input
            id="city"
            type="text"
            className={inputClass(false)}
            {...register('city')}
          />
        </div>
        <div className="flex flex-col gap-1 w-20">
          <label htmlFor="state" className="text-sm font-medium text-gray-700">Estado</label>
          <input
            id="state"
            type="text"
            placeholder="SP"
            maxLength={2}
            className={inputClass(!!errors.state)}
            {...register('state')}
          />
          {errors.state && (
            <p role="alert" className="text-xs text-[--color-danger]">{errors.state.message}</p>
          )}
        </div>
      </div>

      {sectionTitle('Contato')}

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
        <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">WhatsApp</label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="numeric"
          placeholder="Ex: 11999990000"
          className={inputClass(false)}
          {...register('whatsapp')}
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

      {sectionTitle('Redes sociais e links')}

      <div className="flex flex-col gap-1">
        <label htmlFor="website" className="text-sm font-medium text-gray-700">Website</label>
        <input
          id="website"
          type="url"
          placeholder="https://..."
          className={inputClass(!!errors.website)}
          aria-invalid={!!errors.website}
          {...register('website')}
        />
        {errors.website && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.website.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="instagram" className="text-sm font-medium text-gray-700">Instagram</label>
        <input
          id="instagram"
          type="text"
          placeholder="@usuario ou URL"
          className={inputClass(false)}
          {...register('instagram')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="facebook" className="text-sm font-medium text-gray-700">Facebook</label>
        <input
          id="facebook"
          type="text"
          placeholder="@usuario ou URL"
          className={inputClass(false)}
          {...register('facebook')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tiktok" className="text-sm font-medium text-gray-700">TikTok</label>
        <input
          id="tiktok"
          type="text"
          placeholder="@usuario ou URL"
          className={inputClass(false)}
          {...register('tiktok')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="youtube" className="text-sm font-medium text-gray-700">YouTube</label>
        <input
          id="youtube"
          type="text"
          placeholder="URL do canal"
          className={inputClass(false)}
          {...register('youtube')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="googleMapsUrl" className="text-sm font-medium text-gray-700">Google Maps</label>
        <input
          id="googleMapsUrl"
          type="url"
          placeholder="https://maps.google.com/..."
          className={inputClass(!!errors.googleMapsUrl)}
          aria-invalid={!!errors.googleMapsUrl}
          {...register('googleMapsUrl')}
        />
        {errors.googleMapsUrl && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.googleMapsUrl.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="googleBusinessUrl" className="text-sm font-medium text-gray-700">Google Meu Negócio</label>
        <input
          id="googleBusinessUrl"
          type="url"
          placeholder="https://business.google.com/..."
          className={inputClass(!!errors.googleBusinessUrl)}
          aria-invalid={!!errors.googleBusinessUrl}
          {...register('googleBusinessUrl')}
        />
        {errors.googleBusinessUrl && (
          <p role="alert" className="text-xs text-[--color-danger]">{errors.googleBusinessUrl.message}</p>
        )}
      </div>

      <Button type="submit" loading={isLoading} className="w-full mt-2">
        Cadastrar serviço
      </Button>
    </form>
  )
}
