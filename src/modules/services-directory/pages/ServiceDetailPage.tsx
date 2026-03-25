/**
 * @module services-directory
 * @file ServiceDetailPage.tsx
 * @description Public page for viewing a single service listing.
 * Contact info (phone, email, address) requires authentication via ContactGate.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ContactGate from '@/shared/components/ui/ContactGate'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import { SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from '@/modules/services-directory/types'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { service, isLoading, error, getService } = useServicesDirectory()

  useEffect(() => {
    if (id) getService(id)
  }, [id])

  const badgeClass = service ? SERVICE_TYPE_COLORS[service.type] : ''
  const typeLabel = service ? SERVICE_TYPE_LABELS[service.type] : ''

  return (
    <PublicLayout>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">🏥 Serviços</h1>
      </header>
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {service && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xl font-bold text-gray-900">{service.name}</p>
                <span
                  className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
                >
                  {typeLabel}
                </span>
              </div>

              {service.description && (
                <p className="text-sm text-gray-700 mt-2">{service.description}</p>
              )}
            </div>

            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Contato e Localização</p>
              <div className="flex flex-col gap-2">
                <ContactGate
                  value={service.address}
                />
                <ContactGate
                  value={service.phone}
                  href={service.phone ? `tel:${service.phone}` : undefined}
                />
                <ContactGate
                  value={service.email}
                  href={service.email ? `mailto:${service.email}` : undefined}
                />
                {service.website && (
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--color-primary] hover:underline text-sm"
                  >
                    {service.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </PublicLayout>
  )
}
