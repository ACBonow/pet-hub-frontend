/**
 * @module lost-found
 * @file LostFoundDetailPage.tsx
 * @description Page for viewing a single lost or found report.
 */

import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ContactGate from '@/shared/components/ui/ContactGate'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import { useAuthStore } from '@/modules/auth/store/authSlice'
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
  }, [id])

  const isCreator = !!(user?.personId && report?.reporterId && user.personId === report.reporterId)

  const handleDelete = async () => {
    if (!report) return
    await deleteReport(report.id)
    navigate(ROUTES.LOST_FOUND.LIST)
  }

  const isLost = report?.type === 'LOST'
  const formattedAddress = report ? formatAddress(report) : null
  const mapsUrl = report ? buildMapsUrl(report) : null

  return (
    <PublicLayout>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">🔍 Achados e Perdidos</h1>
      </header>
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {report && (
          <div className="flex flex-col gap-4">
            {/* Photo */}
            {report.photoUrl && (
              <img
                src={report.photoUrl}
                alt={report.petName ?? 'Animal'}
                className="w-full max-h-72 object-cover rounded-[--radius-lg] border border-gray-200"
              />
            )}

            {/* Main info */}
            <div
              className={[
                'rounded-[--radius-lg] border p-4',
                isLost ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={[
                    'text-xs font-semibold px-2 py-1 rounded-full',
                    isLost ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700',
                  ].join(' ')}
                >
                  {isLost ? 'Perdido' : 'Achado'}
                </span>
                {report.status === 'RESOLVED' && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                    Resolvido
                  </span>
                )}
              </div>

              <p className="text-xl font-bold text-gray-900">
                {report.petName ?? 'Animal sem nome'}
              </p>

              {formattedAddress && (
                <div className="mt-2 flex items-start gap-1">
                  <span className="text-sm">📍</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{formattedAddress}</p>
                    {report.addressNotes && (
                      <p className="text-xs text-gray-500 mt-0.5">{report.addressNotes}</p>
                    )}
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[--color-primary] hover:underline mt-1 inline-block"
                      >
                        Ver no Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}

              {report.description && (
                <p className="text-sm text-gray-700 mt-3">{report.description}</p>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Contato</p>
              <div className="flex flex-col gap-1">
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

            {isCreator && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {report.status === 'OPEN' && (
                    <button
                      onClick={() => updateStatus(report.id, 'RESOLVED')}
                      disabled={isLoading}
                      className="flex-1 py-2 px-4 rounded-[--radius-lg] border border-green-500 text-green-700 font-medium hover:bg-green-50 transition-colors text-sm disabled:opacity-50"
                    >
                      Marcar como resolvido
                    </button>
                  )}
                  <Link
                    to={ROUTES.LOST_FOUND.EDIT(report.id)}
                    className="text-sm text-[--color-primary] hover:underline shrink-0"
                  >
                    Editar
                  </Link>
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-sm text-[--color-danger] hover:underline shrink-0"
                    >
                      Excluir
                    </button>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="text-sm font-medium text-white bg-[--color-danger] px-2 py-0.5 rounded disabled:opacity-50"
                      >
                        Confirmar exclusão
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-sm text-gray-500 hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </PublicLayout>
  )
}
