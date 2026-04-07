/**
 * @module adoption
 * @file AdoptionDetailPage.tsx
 * @description Page for viewing a single adoption listing.
 */

import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ContactGate from '@/shared/components/ui/ContactGate'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import type { AdoptionStatus } from '@/modules/adoption/types'
import { ROUTES } from '@/routes/routes.config'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponível',
  RESERVED: 'Reservado',
  ADOPTED: 'Adotado',
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  ADOPTED: 'bg-gray-100 text-gray-500',
}

const GENDER_LABELS: Record<string, string> = {
  M: 'Macho',
  F: 'Fêmea',
}

const STATUS_UPDATE_SEQUENCE: { status: AdoptionStatus; label: string }[] = [
  { status: 'AVAILABLE', label: 'Disponível' },
  { status: 'RESERVED', label: 'Reservado' },
  { status: 'ADOPTED', label: 'Adotado' },
]

export default function AdoptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, isLoading, error, getAdoption, updateAdoptionStatus } = useAdoption()
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  const isCreator = !!(user?.personId && listing?.personId && user.personId === listing.personId)

  useEffect(() => {
    if (id) getAdoption(id)
  }, [id])

  const hasContact = listing && (listing.contactEmail || listing.contactPhone || listing.contactWhatsapp)
  const returnTo = encodeURIComponent(location.pathname + location.search)

  return (
    <PublicLayout>
      <header className="sticky top-0 lg:top-16 z-20 bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">❤️ Adoção</h1>
      </header>
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {listing && (
          <div className="flex flex-col gap-4">
            {listing.photoUrl ? (
              <img
                src={listing.photoUrl}
                alt={listing.petName}
                loading="lazy"
                className="w-full rounded-[--radius-lg] object-cover max-h-72"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-[--radius-lg] flex items-center justify-center">
                <span className="text-5xl">🐾</span>
              </div>
            )}

            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xl font-bold text-gray-900">{listing.petName}</p>
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[listing.status] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {STATUS_LABELS[listing.status] ?? listing.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span>{SPECIES_LABELS[listing.species] ?? listing.species}</span>
                {listing.breed && <span>· {listing.breed}</span>}
                {listing.gender && <span>· {GENDER_LABELS[listing.gender] ?? listing.gender}</span>}
                {listing.castrated != null && (
                  <span>· {listing.castrated ? 'Castrado(a)' : 'Não castrado(a)'}</span>
                )}
              </div>

              {listing.description && (
                <p className="text-sm text-gray-700">{listing.description}</p>
              )}

              {hasContact && (
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contato</p>
                  {isAuthenticated ? (
                    <>
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
                          className="text-[--color-primary] hover:underline text-sm"
                        >
                          WhatsApp: {listing.contactWhatsapp}
                        </a>
                      )}
                    </>
                  ) : (
                    <Link
                      to={`${ROUTES.LOGIN}?returnTo=${returnTo}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[--color-primary] hover:underline"
                    >
                      Ver contato — Fazer login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {isCreator && (
              <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Atualizar status</p>
                  <Link
                    to={ROUTES.ADOPTION.EDIT(listing.id)}
                    className="text-sm text-[--color-primary] hover:underline"
                  >
                    Editar
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_UPDATE_SEQUENCE.map(({ status, label }) => (
                    <button
                      key={status}
                      onClick={() => updateAdoptionStatus(listing.id, status)}
                      disabled={listing.status === status || isLoading}
                      className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        listing.status === status
                          ? 'bg-[--color-primary] text-white border-[--color-primary]'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </PublicLayout>
  )
}
