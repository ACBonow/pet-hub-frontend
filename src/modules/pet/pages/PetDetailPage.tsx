/**
 * @module pet
 * @file PetDetailPage.tsx
 * @description Page for viewing pet details, tutorship info, co-tutors, and tutorship history.
 */

import { useEffect, useRef, useState } from 'react'
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
import CpfInput from '@/shared/components/forms/CpfInput'
import { useForm } from 'react-hook-form'
import { validateCpf } from '@/shared/validators/cpf.validator'

function formatBirthDate(dateStr: string): string {
  const birth = new Date(dateStr)
  const formatted = birth.toLocaleDateString('pt-BR')
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (totalMonths < 1) return `Nascimento: ${formatted}`
  const age =
    totalMonths < 12
      ? `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`
      : `${Math.floor(totalMonths / 12)} ${Math.floor(totalMonths / 12) === 1 ? 'ano' : 'anos'}`
  return `Nascimento: ${formatted} (${age})`
}

interface AddCoTutorForm {
  cpf: string
}

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { pet, tutorshipHistory, isLoading, error, getPet, getTutorshipHistory, transferTutorship, uploadPhoto, addCoTutor, removeCoTutor } = usePet()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [showAddCoTutor, setShowAddCoTutor] = useState(false)
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AddCoTutorForm>()

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

  const handleAddCoTutor = handleSubmit(async ({ cpf }) => {
    if (!id) return
    await addCoTutor(id, cpf)
    setShowAddCoTutor(false)
    reset()
  })

  const handleRemoveCoTutor = async (coTutorId: string) => {
    if (!id) return
    await removeCoTutor(id, coTutorId)
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
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pet.gender && (
                      <span className="text-xs text-gray-500">
                        {pet.gender === 'M' ? 'Macho' : pet.gender === 'F' ? 'Fêmea' : pet.gender}
                      </span>
                    )}
                    {pet.castrated === true && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Castrado(a)</span>
                    )}
                    {pet.birthDate && (
                      <span className="text-xs text-gray-500">
                        {formatBirthDate(pet.birthDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Link
                  to={ROUTES.PET.EDIT(pet.id)}
                  className="text-sm font-medium text-[--color-primary] hover:underline"
                >
                  Editar
                </Link>
                <Link
                  to={ROUTES.PET.HEALTH(pet.id)}
                  className="text-sm font-medium text-[--color-primary] hover:underline"
                >
                  Saúde
                </Link>
              </div>
            </div>

            <TutorshipInfo
              tutorId={pet.primaryTutorId}
              tutorshipType={pet.primaryTutorshipType}
            />

            <TutorshipTransfer petId={pet.id} onTransfer={handleTransfer} />

            <CoTutorsList
              coTutors={pet.coTutors}
              onRemove={handleRemoveCoTutor}
            />
            {!showAddCoTutor ? (
              <button
                type="button"
                onClick={() => setShowAddCoTutor(true)}
                className="text-sm text-[--color-primary] hover:underline text-left"
              >
                + Adicionar co-tutor
              </button>
            ) : (
              <form onSubmit={handleAddCoTutor} aria-label="Adicionar co-tutor" className="flex flex-col gap-3 bg-gray-50 rounded-[--radius-md] p-4">
                <CpfInput
                  name="cpf"
                  control={control}
                  label="CPF do co-tutor"
                  rules={{ validate: (v: string) => validateCpf(v) || 'CPF inválido' }}
                />
                {errors.cpf && <p className="text-xs text-[--color-danger]">{errors.cpf.message}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-sm font-medium text-white bg-[--color-primary] px-3 py-1.5 rounded-[--radius-sm] disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Adicionar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddCoTutor(false); reset() }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <TutorshipHistory entries={tutorshipHistory} />
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
