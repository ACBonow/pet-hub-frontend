/**
 * @module lost-found
 * @file LostFoundForm.tsx
 * @description Form for creating lost or found reports.
 */

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import { getGoogleMapsKey } from '@/shared/config/googleMaps'
import type { CreateLostFoundData, LostFoundType } from '@/modules/lost-found/types'

interface LostFoundFormValues {
  type: LostFoundType
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

export interface LostFoundFormSubmitData extends CreateLostFoundData {
  photoFile?: File | null
}

interface LostFoundFormProps {
  onSubmit: (data: LostFoundFormSubmitData) => Promise<void>
  isLoading?: boolean
}

interface ReverseGeocodeComponent {
  long_name: string
  short_name: string
  types: string[]
}
interface ReverseGeocodeResponse {
  status: string
  results: Array<{ address_components: ReverseGeocodeComponent[] }>
}

const inputClass = 'w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]'

export default function LostFoundForm({ onSubmit, isLoading }: LostFoundFormProps) {
  const apiKey = getGoogleMapsKey()
  const [apiError, setApiError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LostFoundFormValues>({
    defaultValues: {
      type: 'LOST',
      petName: '',
      species: '',
      description: '',
      addressStreet: '',
      addressNumber: '',
      addressNeighborhood: '',
      addressCep: '',
      addressCity: '',
      addressState: '',
      addressNotes: '',
      contactEmail: '',
      contactPhone: '',
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setPhotoFile(file)
    if (file) {
      setPhotoPreview(URL.createObjectURL(file))
    } else {
      setPhotoPreview(null)
    }
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    setGeoLoading(true)
    setGeoStatus('idle')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords

          if (apiKey) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=pt-BR`
            const res = await fetch(url)
            const data = await res.json() as ReverseGeocodeResponse

            if (data.status === 'OK' && data.results[0]) {
              const get = (type: string, short = false) => {
                const comp = data.results[0].address_components.find((c) => c.types.includes(type))
                return comp ? (short ? comp.short_name : comp.long_name) : ''
              }
              setValue('addressStreet', get('route'))
              setValue('addressNumber', get('street_number'))
              setValue('addressNeighborhood', get('sublocality_level_1') || get('neighborhood') || get('sublocality'))
              setValue('addressCity', get('administrative_area_level_2'))
              setValue('addressState', get('administrative_area_level_1', true))
              setValue('addressCep', get('postal_code'))
              setGeoStatus('success')
              return
            }
          }

          // Fallback: store coordinates as location text
          setValue('addressNotes', `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          setGeoStatus('success')
        } catch {
          setGeoStatus('error')
        } finally {
          setGeoLoading(false)
        }
      },
      () => {
        setGeoStatus('error')
        setGeoLoading(false)
      },
      { timeout: 8000 },
    )
  }

  const handleFormSubmit = async (data: LostFoundFormValues) => {
    setApiError(null)
    try {
      await onSubmit({
        type: data.type,
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
        photoFile,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao publicar relatório.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select id="type" {...register('type')} className={inputClass}>
            <option value="LOST">Perdido</option>
            <option value="FOUND">Achado</option>
          </select>
        </div>

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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Localização (opcional)
            </legend>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={geoLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[--color-primary] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geoLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Obtendo localização...
                </>
              ) : (
                <>
                  <span>📍</span>
                  Usar minha localização
                </>
              )}
            </button>
          </div>

          {geoStatus === 'success' && (
            <p className="text-xs text-green-600 -mt-1">
              ✓ Endereço preenchido automaticamente. Confira os campos abaixo.
            </p>
          )}
          {geoStatus === 'error' && (
            <p className="text-xs text-[--color-danger] -mt-1">
              Não foi possível obter a localização. Preencha manualmente.
            </p>
          )}

          {/* Rua + Número */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressStreet" className="text-sm text-gray-600">
                Rua
              </label>
              <input id="addressStreet" type="text" {...register('addressStreet')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label htmlFor="addressNumber" className="text-sm text-gray-600">
                Número
              </label>
              <input id="addressNumber" type="text" {...register('addressNumber')} className={inputClass} />
            </div>
          </div>

          {/* Bairro + CEP */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="addressNeighborhood" className="text-sm text-gray-600">
                Bairro
              </label>
              <input id="addressNeighborhood" type="text" {...register('addressNeighborhood')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label htmlFor="addressCep" className="text-sm text-gray-600">
                CEP
              </label>
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
              <label htmlFor="addressCity" className="text-sm text-gray-600">
                Cidade
              </label>
              <input id="addressCity" type="text" {...register('addressCity')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label htmlFor="addressState" className="text-sm text-gray-600">
                Estado
              </label>
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

          {/* Observações do local */}
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

        {/* Foto */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Foto (opcional)</span>
          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Prévia da foto"
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                <span className="text-2xl">📷</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-[--color-primary] hover:underline"
            >
              {photoPreview ? 'Alterar foto' : 'Adicionar foto'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Foto do animal"
            className="hidden"
            onChange={handleFileChange}
          />
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
