/**
 * @module pet
 * @file PetDetailPage.tsx
 * @description Page for viewing pet details, tutorship info, co-tutors, and tutorship history.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { usePet } from '@/modules/pet/hooks/usePet'
import TutorshipInfo from '@/modules/pet/components/TutorshipInfo'
import TutorshipTransfer from '@/modules/pet/components/TutorshipTransfer'
import CoTutorsList from '@/modules/pet/components/CoTutorsList'
import TutorshipHistory from '@/modules/pet/components/TutorshipHistory'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { pet, tutorshipHistory, isLoading, error, getPet, getTutorshipHistory, transferTutorship } = usePet()

  useEffect(() => {
    if (id) {
      getPet(id)
      getTutorshipHistory(id)
    }
  }, [id])

  const handleTransfer = async (data: Parameters<typeof transferTutorship>[1]) => {
    if (id) await transferTutorship(id, data)
  }

  return (
    <AppShell>
      <Header title="Pet" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {pet && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-xl font-bold text-gray-900">{pet.name}</p>
              {pet.breed && <p className="text-sm text-gray-500">{pet.breed}</p>}
            </div>

            <TutorshipInfo
              tutorId={pet.primaryTutorId}
              tutorshipType={pet.primaryTutorshipType}
            />

            <TutorshipTransfer petId={pet.id} onTransfer={handleTransfer} />

            <CoTutorsList coTutors={[]} />

            <TutorshipHistory entries={tutorshipHistory} />
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
