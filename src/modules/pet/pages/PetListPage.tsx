/**
 * @module pet
 * @file PetListPage.tsx
 * @description Page for listing all pets.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { usePet } from '@/modules/pet/hooks/usePet'
import PetCard from '@/modules/pet/components/PetCard'

export default function PetListPage() {
  const { pets, isLoading, error, listPets } = usePet()

  useEffect(() => {
    listPets()
  }, [])

  return (
    <AppShell>
      <Header title="Meus Pets" />
      <PageWrapper>
        <div className="flex justify-end mb-4">
          <Link
            to={ROUTES.PET.CREATE}
            className="text-sm font-medium text-[--color-primary] hover:underline"
          >
            + Novo pet
          </Link>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {!isLoading && !error && pets.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum pet encontrado.</p>
        )}

        <ul className="flex flex-col gap-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </ul>
      </PageWrapper>
    </AppShell>
  )
}
