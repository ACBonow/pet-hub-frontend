import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import ContactGate from '@/shared/components/ui/ContactGate'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import GoogleMapEmbed from '@/shared/components/ui/GoogleMapEmbed'
import type { LostFoundReport } from '@/modules/lost-found/types'

function buildMapsUrl(report: LostFoundReport): string | null {
  const parts = [
    report.addressStreet && report.addressNumber
      ? `${report.addressStreet}, ${report.addressNumber}`
      : report.addressStreet,
    report.addressNeighborhood,
    report.addressCity,
    report.addressState,
    report.addressCep,
  ].filter(Boolean)

  if (parts.length === 0) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(', '))}`
}

function formatAddress(report: LostFoundReport): string | null {
  const line1 = [report.addressStreet, report.addressNumber].filter(Boolean).join(', ')
  const line2 = [report.addressNeighborhood, report.addressCity, report.addressState]
    .filter(Boolean)
    .join(', ')
  const parts = [line1, line2, report.addressCep].filter(Boolean)
  return parts.length > 0 ? parts.join(' — ') : report.location
}

export default function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { report, isLoading, error, getReport, updateStatus, deleteReport } = useLostFound()
  const { user } = useAuthStore()
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (id) getReport(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const isCreator = !!(user?.personId && report?.reporterId && user.personId === report.reporterId)
  const isLost = report?.type === 'LOST'
  const isResolved = report?.status === 'RESOLVED'
  const accentColor = isResolved ? 'var(--muted)' : isLost ? 'var(--red)' : 'var(--green)'
  const formattedAddress = report ? formatAddress(report) : null
  const mapsUrl = report ? buildMapsUrl(report) : null

  const handleDelete = async () => {
    if (!report) return
    await deleteReport(report.id)
    navigate(ROUTES.LOST_FOUND.LIST)
  }

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Back */}
        <Link
          to={ROUTES.LOST_FOUND.LIST}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body transition-colors mb-6"
        >
          <Icon name="arrow" size={14} color="currentColor" className="rotate-180" />
          Voltar para Perdidos &amp; Achados
        </Link>

        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}

        {report && (
          <div className="flex flex-col gap-5 max-w-2xl">

            {/* Photo */}
            {report.photoUrl && (
              <img
                src={report.photoUrl}
                alt={report.petName ?? 'Animal'}
                className="w-full max-h-80 object-cover rounded-2xl border border-line"
              />
            )}

            {/* Main info */}
            <div
              className="bg-card rounded-2xl border border-line overflow-hidden"
              style={{ borderLeft: `4px solid ${accentColor}` }}
            >
              <div className="p-5">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Chip color={accentColor}>
                    {isLost ? 'Perdido' : 'Achado'}
                  </Chip>
                  {isResolved && (
                    <Chip color="var(--muted)" variant="outline">Resolvido</Chip>
                  )}
                </div>

                {/* Name */}
                <h1 className="font-fraunces font-black text-4xl text-ink leading-none tracking-tight">
                  {report.petName ?? 'Animal sem nome'}
                </h1>

                {/* Location */}
                {formattedAddress && (
                  <div className="mt-4 flex items-start gap-2">
                    <Icon name="pin" size={16} color="var(--muted)" className="shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-body">{formattedAddress}</p>
                      {report.addressNotes && (
                        <p className="text-xs text-muted mt-1">{report.addressNotes}</p>
                      )}
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-green hover:underline mt-1.5 inline-flex items-center gap-1"
                        >
                          Ver no Google Maps <Icon name="arrow" size={11} color="var(--green)" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {report.description && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Descrição</p>
                    <p className="text-sm text-body leading-relaxed">{report.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {formattedAddress && (
              <GoogleMapEmbed address={formattedAddress} />
            )}

            {/* Contact */}
            <div className="bg-card rounded-2xl border border-line p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Contato</p>
              <div className="flex flex-col gap-2">
                <ContactGate
                  value={report.contactEmail}
                  href={report.contactEmail ? `mailto:${report.contactEmail}` : undefined}
                />
                <ContactGate
                  value={report.contactPhone}
                  href={report.contactPhone ? `tel:${report.contactPhone}` : undefined}
                />
              </div>
            </div>

            {/* Creator controls */}
            {isCreator && (
              <div className="bg-card rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {!isResolved && (
                      <button
                        onClick={() => updateStatus(report.id, 'RESOLVED')}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-green text-green font-semibold text-sm hover:bg-green-light transition-colors disabled:opacity-50"
                      >
                        <Icon name="check" size={14} color="var(--green)" />
                        Marcar como resolvido
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to={ROUTES.LOST_FOUND.EDIT(report.id)}
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
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
