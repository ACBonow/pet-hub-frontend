import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import { ROUTES } from '@/routes/routes.config'
import { usePet } from '@/modules/pet/hooks/usePet'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import TutorshipInfo from '@/modules/pet/components/TutorshipInfo'
import TutorshipTransfer from '@/modules/pet/components/TutorshipTransfer'
import CoTutorsList from '@/modules/pet/components/CoTutorsList'
import TutorshipHistory from '@/modules/pet/components/TutorshipHistory'
import CpfInput from '@/shared/components/forms/CpfInput'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import { useForm } from 'react-hook-form'

type Tab = 'info' | 'tutoria'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão', cat: 'Gato', bird: 'Ave', rabbit: 'Coelho', other: 'Outro',
}
const GENDER_LABELS: Record<string, string> = { M: 'Macho', F: 'Fêmea' }

function formatAge(dateStr: string): string {
  const birth = new Date(dateStr)
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (totalMonths < 1) return 'Filhote'
  if (totalMonths < 12) return `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`
  const years = Math.floor(totalMonths / 12)
  return `${years} ${years === 1 ? 'ano' : 'anos'}`
}

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

interface AddCoTutorForm { cpf: string }

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pet, tutorshipHistory, isLoading, error, getPet, getTutorshipHistory, transferTutorship, uploadPhoto, addCoTutor, removeCoTutor, deletePet } = usePet()
  const { user } = useAuthStore()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<Tab>('info')
  const [showAddCoTutor, setShowAddCoTutor] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AddCoTutorForm>()

  const isTutor = !!user?.personId && !!pet && user.personId === pet.primaryTutorId

  useEffect(() => {
    if (id) { getPet(id); getTutorshipHistory(id) }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleDelete = async () => {
    if (!id) return
    await deletePet(id)
    navigate(ROUTES.PET.LIST)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'Informações' },
    { id: 'tutoria', label: 'Tutoria' },
  ]

  return (
    <AppShell>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Back */}
        <Link
          to={ROUTES.PET.LIST}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body transition-colors mb-6"
        >
          <Icon name="arrow" size={14} color="currentColor" className="rotate-180" />
          Meus Pets
        </Link>

        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}

        {pet && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7 pet-detail-grid">

            {/* ── Left column ─────────────────────────── */}
            <div>
              {/* Photo */}
              <div className="relative mb-5">
                {pet.photoUrl ? (
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-full h-[300px] object-cover rounded-2xl border border-line"
                  />
                ) : (
                  <div
                    className="w-full h-[300px] rounded-2xl border border-line flex items-center justify-center"
                    style={{ background: 'repeating-linear-gradient(135deg, var(--soft), var(--soft) 8px, var(--line) 8px, var(--line) 16px)' }}
                  >
                    <Icon name="paw" size={64} color="var(--muted)" />
                  </div>
                )}
                {isTutor && (
                  <>
                    <button
                      type="button"
                      aria-label="Alterar foto"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-green text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                    >
                      <Icon name="image" size={16} color="#fff" />
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </>
                )}
              </div>

              {/* Name & basic info */}
              <h1 className="font-fraunces font-black text-4xl text-ink leading-tight tracking-tight">
                {pet.name}
              </h1>
              {pet.breed && (
                <p className="text-muted text-sm mt-1">
                  {SPECIES_LABELS[pet.species] ?? pet.species} · {pet.breed}
                </p>
              )}

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {pet.gender && (
                  <Chip color="var(--info)" variant="outline">
                    {GENDER_LABELS[pet.gender] ?? pet.gender}
                  </Chip>
                )}
                {pet.castrated === true && (
                  <Chip color="var(--green)" variant="outline">Castrado(a)</Chip>
                )}
                {pet.birthDate && (
                  <Chip color="var(--muted)" variant="outline">{formatAge(pet.birthDate)}</Chip>
                )}
              </div>

              {/* Stats mini-cards */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  to={ROUTES.PET.HEALTH(pet.id)}
                  className="bg-card border border-line rounded-xl p-3 text-center hover:bg-soft transition-colors"
                >
                  <p className="text-sm font-bold text-green">Saúde</p>
                  <p className="text-[10px] text-muted mt-0.5">Carteirinha</p>
                </Link>
                <div className="bg-card border border-line rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-body">
                    {pet.birthDate ? formatAge(pet.birthDate) : '—'}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Idade</p>
                </div>
              </div>

              {/* Owner actions */}
              {isTutor && (
                <div className="mt-5 flex items-center gap-4 flex-wrap">
                  <Link
                    to={ROUTES.PET.EDIT(pet.id)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-green hover:underline"
                  >
                    <Icon name="edit" size={13} color="var(--green)" /> Editar
                  </Link>
                  {!confirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="text-sm font-medium text-red hover:underline"
                    >
                      Excluir
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="text-sm font-medium text-white bg-red px-2.5 py-1 rounded-lg disabled:opacity-50"
                      >
                        Confirmar exclusão
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="text-sm text-muted hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Right column ────────────────────────── */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1.5 bg-soft p-1 rounded-xl w-fit mb-6">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
                      tab === t.id
                        ? 'bg-card text-body shadow-sm'
                        : 'text-muted hover:text-body'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab: Informações */}
              {tab === 'info' && (
                <div className="bg-card border border-line rounded-2xl overflow-hidden">
                  {[
                    ['Espécie', SPECIES_LABELS[pet.species] ?? pet.species],
                    ['Raça', pet.breed ?? '—'],
                    ['Sexo', pet.gender ? (GENDER_LABELS[pet.gender] ?? pet.gender) : '—'],
                    ['Castrado', pet.castrated == null ? '—' : pet.castrated ? 'Sim' : 'Não'],
                    ['Nascimento', pet.birthDate ? formatBirthDate(pet.birthDate) : '—'],
                  ].map(([label, value], i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between items-center px-5 py-4 text-sm ${
                        i < arr.length - 1 ? 'border-b border-line' : ''
                      }`}
                    >
                      <span className="text-muted">{label}</span>
                      <span className="font-semibold text-body text-right">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Tutoria */}
              {tab === 'tutoria' && (
                <div className="flex flex-col gap-5">
                  <TutorshipInfo
                    tutorId={pet.primaryTutorId}
                    tutorshipType={pet.primaryTutorshipType}
                  />
                  <TutorshipTransfer petId={pet.id} onTransfer={handleTransfer} />
                  <CoTutorsList coTutors={pet.coTutors} onRemove={handleRemoveCoTutor} />

                  {/* Add co-tutor */}
                  {!showAddCoTutor ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCoTutor(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:underline text-left"
                    >
                      <Icon name="plus" size={14} color="var(--green)" /> Adicionar co-tutor
                    </button>
                  ) : (
                    <form
                      onSubmit={handleAddCoTutor}
                      aria-label="Adicionar co-tutor"
                      className="bg-soft rounded-xl p-4 flex flex-col gap-3"
                    >
                      <CpfInput name="cpf" control={control} label="CPF do co-tutor" />
                      {errors.cpf && (
                        <p className="text-xs text-red">{errors.cpf.message}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="text-sm font-semibold text-white bg-green px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {isLoading ? 'Salvando...' : 'Adicionar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowAddCoTutor(false); reset() }}
                          className="text-sm text-muted hover:underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  <TutorshipHistory entries={tutorshipHistory} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 1024px) { .pet-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </AppShell>
  )
}
