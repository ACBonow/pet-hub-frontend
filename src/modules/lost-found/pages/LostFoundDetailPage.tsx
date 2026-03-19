/**
 * @module lost-found
 * @file LostFoundDetailPage.tsx
 * @description Page for viewing a single lost or found report.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'

export default function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { report, isLoading, error, getReport } = useLostFound()

  useEffect(() => {
    if (id) getReport(id)
  }, [id])

  const isLost = report?.type === 'LOST'

  return (
    <AppShell>
      <Header title={isLost ? 'Animal Perdido' : 'Animal Achado'} />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {report && (
          <div className="flex flex-col gap-4">
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
              {report.location && (
                <p className="text-sm text-gray-600 mt-1">📍 {report.location}</p>
              )}
              {report.description && (
                <p className="text-sm text-gray-700 mt-2">{report.description}</p>
              )}
            </div>

            {(report.contactEmail || report.contactPhone) && (
              <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Contato</p>
                {report.contactEmail && (
                  <p className="text-sm">
                    <a href={`mailto:${report.contactEmail}`} className="text-[--color-primary]">
                      {report.contactEmail}
                    </a>
                  </p>
                )}
                {report.contactPhone && (
                  <p className="text-sm text-gray-600">{report.contactPhone}</p>
                )}
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
