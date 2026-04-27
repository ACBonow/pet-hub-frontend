import { useEffect, useState } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import ContactGate from '@/shared/components/ui/ContactGate'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import type { AdoptionStatus } from '@/modules/adoption/types'
import { ROUTES } from '@/routes/routes.config'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão', cat: 'Gato', bird: 'Ave', rabbit: 'Coelho', other: 'Outro',
}
const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponível', RESERVED: 'Reservado', ADOPTED: 'Adotado',
}
const GENDER_LABELS: Record<string, string> = { M: 'Macho', F: 'Fêmea' }

const STATUS_CHIP_COLORS: Record<string, string> = {
  AVAILABLE: 'var(--green)',
  RESERVED: 'var(--yellow-dark)',
  ADOPTED: 'var(--muted)',
}

const STATUS_UPDATE_SEQUENCE: { status: AdoptionStatus; label: string }[] = [
  { status: 'AVAILABLE', label: 'Disponível' },
  { status: 'RESERVED', label: 'Reservado' },
  { status: 'ADOPTED', label: 'Adotado' },
]

export default function AdoptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { listing, isLoading, error, getAdoption, updateAdoptionStatus, deleteAdoption } = useAdoption()
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isCreator = !!(user?.personId && listing?.personId && user.personId === listing.personId)
  const returnTo = encodeURIComponent(location.pathname + location.search)
  const hasContact = listing && (listing.contactEmail || listing.contactPhone || listing.contactWhatsapp)

  const handleDelete = async () => {
    if (!listing) return
    await deleteAdoption(listing.id)
    navigate(ROUTES.ADOPTION.LIST)
  }

  useEffect(() => {
    if (id) getAdoption(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Back */}
        <Link
          to={ROUTES.ADOPTION.LIST}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body transition-colors mb-6"
        >
          <Icon name="arrow" size={14} color="currentColor" className="rotate-180" />
          Voltar para adoção
        </Link>

        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}

        {listing && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-7 adopt-detail-grid">

            {/* Photo column */}
            <div>
              {listing.photoUrl ? (
                <img
                  src={listing.photoUrl}
                  alt={listing.petName}
                  loading="lazy"
                  className="w-full h-[420px] object-cover rounded-2xl"
                />
              ) : (
                <div
                  className="w-full h-[420px] rounded-2xl flex items-center justify-center"
                  style={{ background: 'repeating-linear-gradient(135deg, var(--soft), var(--soft) 8px, var(--line) 8px, var(--line) 16px)' }}
                >
                  <Icon name="paw" size={64} color="var(--muted)" />
                </div>
              )}
            </div>

            {/* Data column */}
            <div>
              {/* Chips */}
              <div className="flex gap-2 flex-wrap mb-4">
                <Chip color={STATUS_CHIP_COLORS[listing.status] ?? 'var(--muted)'}>
                  {STATUS_LABELS[listing.status] ?? listing.status}
                </Chip>
                <Chip color="var(--green)" variant="outline">
                  {SPECIES_LABELS[listing.species] ?? listing.species}
                </Chip>
              </div>

              {/* Name */}
              <h1 className="font-fraunces font-black text-5xl text-ink leading-none tracking-tight">
                {listing.petName}
              </h1>

              {/* Attributes row */}
              <p className="text-muted text-base mt-3">
                {listing.breed && `${listing.breed} · `}
                {listing.gender ? `${GENDER_LABELS[listing.gender] ?? listing.gender}` : ''}
                {listing.castrated != null && ` · ${listing.castrated ? 'Castrado(a)' : 'Não castrado(a)'}`}
              </p>

              {/* Stat mini-cards */}
              {(listing.breed || listing.gender || listing.castrated != null) && (
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    { label: 'Espécie', value: SPECIES_LABELS[listing.species] ?? listing.species },
                    { label: 'Sexo', value: listing.gender ? (GENDER_LABELS[listing.gender] ?? listing.gender) : '—' },
                    { label: 'Castrado', value: listing.castrated == null ? '—' : listing.castrated ? 'Sim' : 'Não' },
                  ].map((a) => (
                    <div key={a.label} className="bg-card border border-line rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-body">{a.value}</p>
                      <p className="text-[10px] text-muted mt-0.5">{a.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Sobre</p>
                  <p className="text-sm text-body leading-relaxed">{listing.description}</p>
                </div>
              )}

              {/* Contact */}
              {hasContact && (
                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Contato</p>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1.5">
                      <ContactGate
                        value={listing.contactEmail}
                        href={listing.contactEmail ? `mailto:${listing.contactEmail}` : undefined}
                      />
                      <ContactGate
                        value={listing.contactPhone}
                        href={listing.contactPhone ? `tel:${listing.contactPhone}` : undefined}
                      />
                      {listing.contactWhatsapp && (
                        <a
                          href={`https://wa.me/${listing.contactWhatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green hover:underline"
                        >
                          WhatsApp: {listing.contactWhatsapp}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
                      style={{ background: 'var(--yellow)22', border: '1px dashed var(--yellow-dark)55' }}
                    >
                      <Icon name="lock" size={16} color="var(--yellow-dark)" />
                      <span className="text-body">
                        Contato protegido —{' '}
                        <Link to={`${ROUTES.LOGIN}?returnTo=${returnTo}`} className="font-semibold text-yellow-dark hover:underline">
                          faça login
                        </Link>{' '}
                        para ver.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3 mt-7 flex-wrap">
                <Link
                  to={isAuthenticated ? `${ROUTES.LOGIN}?returnTo=${returnTo}` : ROUTES.ADOPTION.LIST}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-line text-body hover:bg-soft transition-colors"
                >
                  <Icon name="chat" size={15} color="currentColor" /> Conversar
                </Link>
                <Link
                  to={isAuthenticated ? `${ROUTES.LOGIN}?returnTo=${returnTo}` : ROUTES.ADOPTION.LIST}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-red text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="heart" size={15} color="#fff" /> Quero adotar
                </Link>
              </div>

              {/* Creator panel */}
              {isCreator && (
                <div className="mt-6 bg-card border border-line rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-body">Atualizar status</p>
                    <div className="flex items-center gap-3">
                      <Link
                        to={ROUTES.ADOPTION.EDIT(listing.id)}
                        className="text-sm font-medium text-green hover:underline flex items-center gap-1"
                      >
                        <Icon name="edit" size={13} color="var(--green)" /> Editar
                      </Link>
                      {!confirmDelete ? (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="text-sm font-medium text-red hover:underline"
                        >
                          Excluir
                        </button>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="text-sm font-medium text-white bg-red px-2.5 py-1 rounded-lg disabled:opacity-50"
                          >
                            Confirmar exclusão
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-sm text-muted hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_UPDATE_SEQUENCE.map(({ status, label }) => (
                      <button
                        key={status}
                        onClick={() => updateAdoptionStatus(listing.id, status)}
                        disabled={listing.status === status || isLoading}
                        className={`text-sm px-4 py-2 rounded-xl border font-semibold transition-colors ${
                          listing.status === status
                            ? 'bg-green text-white border-green'
                            : 'border-line text-body hover:bg-soft disabled:opacity-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 880px) { .adopt-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PublicLayout>
  )
}
