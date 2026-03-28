/**
 * @module services-directory
 * @file ServiceDetailPage.tsx
 * @description Public page for viewing a single service listing.
 * Contact info requires authentication via ContactGate.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ContactGate from '@/shared/components/ui/ContactGate'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { service, isLoading, error, getService } = useServicesDirectory()

  useEffect(() => {
    if (id) getService(id)
  }, [id])

  // Build address string from structured fields
  const addressParts = service
    ? [
        service.street && service.number
          ? `${service.street}, ${service.number}`
          : service.street,
        service.complement,
        service.neighborhood,
        service.city && service.state
          ? `${service.city} - ${service.state}`
          : service.city || service.state,
        service.zipCode ? `CEP: ${service.zipCode}` : null,
      ].filter(Boolean)
    : []
  const fullAddress = addressParts.length > 0 ? addressParts.join(' — ') : null

  const badgeClass = service?.serviceType.color ?? ''
  const typeLabel = service?.serviceType.label ?? ''

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
            {/* Header */}
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

            {/* Contact & Address */}
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Contato e Localização</p>
              <div className="flex flex-col gap-2">
                {fullAddress && (
                  <ContactGate value={fullAddress} />
                )}
                {service.googleMapsUrl && (
                  <a
                    href={service.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--color-primary] hover:underline text-sm"
                  >
                    Ver no Google Maps
                  </a>
                )}
                <ContactGate
                  value={service.phone}
                  href={service.phone ? `tel:${service.phone}` : undefined}
                />
                {service.whatsapp && (
                  <ContactGate
                    value={`WhatsApp: ${service.whatsapp}`}
                    href={`https://wa.me/55${service.whatsapp.replace(/\D/g, '')}`}
                  />
                )}
                <ContactGate
                  value={service.email}
                  href={service.email ? `mailto:${service.email}` : undefined}
                />
              </div>
            </div>

            {/* Online presence */}
            {(service.website || service.instagram || service.facebook || service.tiktok || service.youtube || service.googleBusinessUrl) && (
              <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Redes sociais e links</p>
                <div className="flex flex-col gap-2">
                  {service.website && (
                    <a href={service.website} target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      🌐 Website
                    </a>
                  )}
                  {service.instagram && (
                    <a href={service.instagram.startsWith('http') ? service.instagram : `https://instagram.com/${service.instagram.replace('@', '')}`}
                       target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      📸 Instagram
                    </a>
                  )}
                  {service.facebook && (
                    <a href={service.facebook.startsWith('http') ? service.facebook : `https://facebook.com/${service.facebook}`}
                       target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      📘 Facebook
                    </a>
                  )}
                  {service.tiktok && (
                    <a href={service.tiktok.startsWith('http') ? service.tiktok : `https://tiktok.com/@${service.tiktok.replace('@', '')}`}
                       target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      🎵 TikTok
                    </a>
                  )}
                  {service.youtube && (
                    <a href={service.youtube} target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      ▶️ YouTube
                    </a>
                  )}
                  {service.googleBusinessUrl && (
                    <a href={service.googleBusinessUrl} target="_blank" rel="noopener noreferrer"
                       className="text-[--color-primary] hover:underline text-sm">
                      📍 Google Meu Negócio
                    </a>
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
