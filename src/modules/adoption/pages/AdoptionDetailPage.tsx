/**
 * @module adoption
 * @file AdoptionDetailPage.tsx
 * @description Page for viewing a single adoption listing.
 */

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

export default function AdoptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, isLoading, error, getAdoption } = useAdoption()

  useEffect(() => {
    if (id) getAdoption(id)
  }, [id])

  return (
    <AppShell>
      <Header title="Adoção" />
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
                className="w-full rounded-[--radius-lg] object-cover max-h-64"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-[--radius-lg] flex items-center justify-center">
                <span className="text-5xl">🐾</span>
              </div>
            )}

            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-xl font-bold text-gray-900">{listing.petName}</p>
              <p className="text-sm text-gray-500">
                {SPECIES_LABELS[listing.species] ?? listing.species}
                {listing.breed ? ` · ${listing.breed}` : ''}
              </p>
              {listing.description && (
                <p className="text-sm text-gray-700 mt-2">{listing.description}</p>
              )}
              {listing.contactEmail && (
                <p className="text-sm text-[--color-primary] mt-2">
                  <a href={`mailto:${listing.contactEmail}`}>{listing.contactEmail}</a>
                </p>
              )}
            </div>
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
