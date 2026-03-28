/**
 * @module lost-found
 * @file LostFoundDetailPage.tsx
 * @description Page for viewing a single lost or found report.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ContactGate from '@/shared/components/ui/ContactGate'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
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
  const { report, isLoading, error, getReport } = useLostFound()

  useEffect(() => {
    if (id) getReport(id)
  }, [id])

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
          </div>
        )}
      </PageWrapper>
    </PublicLayout>
  )
}
