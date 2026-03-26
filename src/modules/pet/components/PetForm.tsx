/**
 * @module pet
 * @file PetForm.tsx
 * @description Form for creating and editing pets.
 */

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { TutorshipType } from '@/modules/pet/types'

export interface PetFormValues {
  name: string
  species: string
  breed: string
  gender: string
  castrated: boolean
  birthDate: string
  tutorshipType: TutorshipType
  photoFile?: File
}

interface PetFormProps {
  onSubmit: (data: PetFormValues) => Promise<void>
  initialData?: Partial<PetFormValues> & { photoUrl?: string | null; gender?: string | null; castrated?: boolean | null }
  isLoading?: boolean
}

export default function PetForm({ onSubmit, initialData, isLoading }: PetFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormValues>({
    defaultValues: {
      name: initialData?.name ?? '',
      species: initialData?.species ?? '',
      breed: initialData?.breed ?? '',
      gender: initialData?.gender ?? '',
      castrated: initialData?.castrated ?? false,
      birthDate: initialData?.birthDate ?? '',
      tutorshipType: initialData?.tutorshipType ?? 'OWNER',
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleFormSubmit = async (data: PetFormValues) => {
    setApiError(null)
    try {
      await onSubmit({ ...data, photoFile: photoFile ?? undefined })
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
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Sexo
          </label>
          <select
            id="gender"
            {...register('gender')}
            className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          >
            <option value="">Não informado</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="castrated"
            type="checkbox"
            {...register('castrated')}
            className="w-5 h-5 accent-[--color-primary]"
          />
          <label htmlFor="castrated" className="text-sm font-medium text-gray-700">
            Castrado(a)
          </label>
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

        {/* Photo upload */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Foto (opcional)</span>
          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Prévia da foto"
                className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                <span className="text-2xl">🐾</span>
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
            aria-label="Foto do pet"
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
          Salvar
        </Button>
      </div>
    </form>
  )
}
