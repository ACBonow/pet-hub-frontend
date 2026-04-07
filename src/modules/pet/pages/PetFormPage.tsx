/**
 * @module pet
 * @file PetFormPage.tsx
 * @description Page for creating a new pet.
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import PetForm from '@/modules/pet/components/PetForm'
import { usePet } from '@/modules/pet/hooks/usePet'
import ActingAsSelector from '@/shared/components/ui/ActingAsSelector'
import { useActingAs } from '@/shared/hooks/useActingAs'
import { compressImage } from '@/shared/utils/image'

export default function PetFormPage() {
  const navigate = useNavigate()
  const { isLoading, createPet, uploadPhoto } = usePet()
  const { context } = useActingAs()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const pet = await createPet({
      name: data.name,
      species: data.species,
      breed: data.breed || null,
      gender: data.gender || null,
      castrated: data.castrated ?? null,
      birthDate: data.birthDate || null,
      tutorshipType: data.tutorshipType,
      organizationId: context.type === 'org' ? context.organizationId ?? null : null,
    })
    if (data.photoFile) {
      const photo = await compressImage(data.photoFile)
      await uploadPhoto(pet.id, photo)
    }
    navigate(ROUTES.PET.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Pet" showBack />
      <PageWrapper>
        <div className="flex flex-col gap-4">
          <ActingAsSelector />
          <PetForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </PageWrapper>
    </AppShell>
  )
}
