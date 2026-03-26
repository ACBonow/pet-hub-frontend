/**
 * @module pet
 * @file PetEditPage.tsx
 * @description Page for editing an existing pet's data.
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import PetForm from '@/modules/pet/components/PetForm'
import { usePet } from '@/modules/pet/hooks/usePet'

export default function PetEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pet, isLoading, getPet, updatePet, uploadPhoto } = usePet()

  useEffect(() => {
    if (id) getPet(id)
  }, [id])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    if (!id) return
    await updatePet(id, {
      name: data.name,
      species: data.species,
      breed: data.breed || null,
      gender: data.gender || null,
      castrated: data.castrated ?? null,
      birthDate: data.birthDate || null,
    })
    if (data.photoFile) {
      await uploadPhoto(id, data.photoFile)
    }
    navigate(ROUTES.PET.DETAIL(id))
  }

  const initialData = pet
    ? {
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? '',
        gender: pet.gender ?? '',
        castrated: pet.castrated ?? false,
        birthDate: pet.birthDate ? pet.birthDate.slice(0, 10) : '',
        photoUrl: pet.photoUrl,
      }
    : undefined

  return (
    <AppShell>
      <Header title="Editar Pet" showBack />
      <PageWrapper>
        {isLoading && !pet && <p className="text-sm text-gray-500">Carregando...</p>}
        {pet && (
          <PetForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isLoading={isLoading}
          />
        )}
      </PageWrapper>
    </AppShell>
  )
}
