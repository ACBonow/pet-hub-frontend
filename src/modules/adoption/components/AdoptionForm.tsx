/**
 * @module adoption
 * @file AdoptionForm.tsx
 * @description Form for creating adoption listings with an integrated pet picker.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import PetPickerModal from '@/modules/adoption/components/PetPickerModal'
import type { CreateAdoptionData } from '@/modules/adoption/types'
import type { Pet } from '@/modules/pet/types'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

interface AdoptionFormValues {
  description: string
  contactEmail: string
  contactPhone: string
  contactWhatsapp: string
}

interface AdoptionFormProps {
  onSubmit: (data: CreateAdoptionData) => Promise<void>
  isLoading?: boolean
}

export default function AdoptionForm({ onSubmit, isLoading }: AdoptionFormProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [petError, setPetError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdoptionFormValues>({
    defaultValues: {
      description: '',
      contactEmail: '',
      contactPhone: '',
      contactWhatsapp: '',
    },
  })

  const handleFormSubmit = async (data: AdoptionFormValues) => {
    if (!selectedPet) {
      setPetError('Selecione um pet para continuar.')
      return
    }
    setPetError(null)
    setApiError(null)
    try {
      await onSubmit({
        petId: selectedPet.id,
        description: data.description || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        contactWhatsapp: data.contactWhatsapp || null,
      })
    } catch (err) {
      const error = err as { message?: string }
      setApiError(error.message ?? 'Erro ao criar anúncio.')
    }
  }

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet)
    setPetError(null)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {/* Pet selector */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Pet para adoção</span>

            {selectedPet ? (
              <div className="flex items-center justify-between p-3 border border-[--color-primary] rounded-[--radius-md] bg-primary-50">
                <div className="flex items-center gap-3">
                  {selectedPet.photoUrl ? (
                    <img
                      src={selectedPet.photoUrl}
                      alt={selectedPet.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-lg">🐾</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-900">{selectedPet.name}</p>
                    <p className="text-xs text-gray-500">
                      {SPECIES_LABELS[selectedPet.species] ?? selectedPet.species}
                      {selectedPet.breed ? ` · ${selectedPet.breed}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-[--color-primary] hover:underline shrink-0 ml-2"
                >
                  Trocar pet
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={[
                  'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm text-left',
                  'text-gray-400 hover:border-[--color-primary] transition-colors',
                  petError ? 'border-[--color-danger]' : 'border-gray-300',
                ].join(' ')}
              >
                Selecionar pet
              </button>
            )}

            {petError && (
              <p role="alert" className="text-xs text-[--color-danger]">{petError}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            />
          </div>

          {/* Contact email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
              Email de contato
            </label>
            <input
              id="contactEmail"
              type="email"
              {...register('contactEmail', {
                validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido.',
              })}
              className={[
                'w-full min-h-[44px] px-3 py-2 border rounded-[--radius-md] text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                errors.contactEmail ? 'border-[--color-danger]' : 'border-gray-300',
              ].join(' ')}
            />
            {errors.contactEmail && (
              <p role="alert" className="text-xs text-[--color-danger]">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Contact phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
              Telefone de contato (opcional)
            </label>
            <input
              id="contactPhone"
              type="tel"
              {...register('contactPhone')}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contactWhatsapp" className="text-sm font-medium text-gray-700">
              WhatsApp (opcional)
            </label>
            <input
              id="contactWhatsapp"
              type="tel"
              {...register('contactWhatsapp')}
              className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
            />
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-[--color-danger]">{apiError}</p>
          )}

          <Button type="submit" loading={isLoading}>
            Publicar anúncio
          </Button>
        </div>
      </form>

      <PetPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectPet}
      />
    </>
  )
}
