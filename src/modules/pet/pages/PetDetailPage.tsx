/**
 * @module pet
 * @file PetDetailPage.tsx
 * @description Page for viewing pet details, tutorship info, co-tutors, and tutorship history.
 */

import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { ROUTES } from '@/routes/routes.config'
import { usePet } from '@/modules/pet/hooks/usePet'
import TutorshipInfo from '@/modules/pet/components/TutorshipInfo'
import TutorshipTransfer from '@/modules/pet/components/TutorshipTransfer'
import CoTutorsList from '@/modules/pet/components/CoTutorsList'
import TutorshipHistory from '@/modules/pet/components/TutorshipHistory'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { pet, tutorshipHistory, isLoading, error, getPet, getTutorshipHistory, transferTutorship, uploadPhoto } = usePet()
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      getPet(id)
      getTutorshipHistory(id)
    }
  }, [id])

  const handleTransfer = async (data: Parameters<typeof transferTutorship>[1]) => {
    if (id) await transferTutorship(id, data)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return
    await uploadPhoto(id, file)
    await getPet(id)
  }

  return (
    <AppShell>
      <Header title="Pet" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {pet && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4 flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {pet.photoUrl ? (
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-2xl">🐾</span>
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label="Alterar foto"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[--color-primary] text-white flex items-center justify-center text-xs leading-none"
                  >
                    +
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{pet.name}</p>
                  {pet.breed && <p className="text-sm text-gray-500">{pet.breed}</p>}
                </div>
              </div>
              <Link
                to={ROUTES.PET.HEALTH(pet.id)}
                className="text-sm font-medium text-[--color-primary] hover:underline shrink-0"
              >
                Saúde
              </Link>
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
