/**
 * @module adoption
 * @file PetPickerModal.tsx
 * @description Modal for selecting an existing pet or registering a new one for an adoption listing.
 */

import { useEffect, useState } from 'react'
import Modal from '@/shared/components/ui/Modal'
import Button from '@/shared/components/ui/Button'
import PetForm from '@/modules/pet/components/PetForm'
import { usePet } from '@/modules/pet/hooks/usePet'
import type { Pet } from '@/modules/pet/types'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

interface PetPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (pet: Pet) => void
}

export default function PetPickerModal({ isOpen, onClose, onSelect }: PetPickerModalProps) {
  const { pets, isLoading, listPets, createPet, uploadPhoto } = usePet()
  const [showNewForm, setShowNewForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      listPets()
      setShowNewForm(false)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectPet = (pet: Pet) => {
    onSelect(pet)
    onClose()
  }

  const handleNewPetSubmit = async (data: {
    name: string
    species: string
    breed: string
    birthDate: string
    tutorshipType: 'OWNER' | 'TUTOR' | 'TEMPORARY_HOME'
    photoFile?: File
  }) => {
    setIsCreating(true)
    try {
      const newPet = await createPet({
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        birthDate: data.birthDate || null,
        tutorshipType: data.tutorshipType,
      })
      if (data.photoFile) {
        await uploadPhoto(newPet.id, data.photoFile)
      }
      onSelect(newPet)
      onClose()
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selecionar pet" className="max-h-[80vh] overflow-y-auto">
      {showNewForm ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowNewForm(false)}
            className="flex items-center gap-1 text-sm text-[--color-primary] hover:underline self-start"
          >
            ← Voltar
          </button>
          <p className="text-sm font-medium text-gray-700">Novo pet</p>
          <PetForm onSubmit={handleNewPetSubmit} isLoading={isCreating} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading && (
            <p className="text-sm text-gray-500 text-center py-4">Carregando...</p>
          )}

          {!isLoading && pets.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Você ainda não tem pets cadastrados.
            </p>
          )}

          {!isLoading && pets.length > 0 && (
            <ul className="flex flex-col gap-2">
              {pets.map((pet) => (
                <li key={pet.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectPet(pet)}
                    className={[
                      'w-full flex items-center gap-3 p-3 rounded-[--radius-md]',
                      'border border-gray-200 hover:border-[--color-primary]',
                      'hover:bg-primary-50 transition-colors text-left',
                    ].join(' ')}
                  >
                    {pet.photoUrl ? (
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-lg">🐾</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{pet.name}</p>
                      <p className="text-xs text-gray-500">
                        {SPECIES_LABELS[pet.species] ?? pet.species}
                        {pet.breed ? ` · ${pet.breed}` : ''}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && (
            <>
              {pets.length > 0 && (
                <div className="border-t border-gray-100 pt-3" />
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewForm(true)}
              >
                Cadastrar novo pet
              </Button>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
