/**
 * @module adoption
 * @file AdoptionListPage.tsx
 * @description Public page listing pets available for adoption with filters.
 */

import { useEffect, useState } from 'react'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import AdoptionCard from '@/modules/adoption/components/AdoptionCard'
import AdoptionFiltersBar from '@/modules/adoption/components/AdoptionFilters'
import type { AdoptionFilters } from '@/modules/adoption/types'

export default function AdoptionListPage() {
  const { listings, isLoading, error, listAdoptions } = useAdoption()
  const [filters, setFilters] = useState<AdoptionFilters>({})

  useEffect(() => {
    listAdoptions(filters)
  }, [])

  const handleFiltersChange = (newFilters: AdoptionFilters) => {
    setFilters(newFilters)
    listAdoptions(newFilters)
  }

  return (
    <AppShell>
      <Header title="Adoção" />
      <PageWrapper>
        <AdoptionFiltersBar filters={filters} onChange={handleFiltersChange} />

        {isLoading && <p className="text-sm text-gray-500 mt-4">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger] mt-4">{error}</p>}

        {!isLoading && !error && listings.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">Nenhum pet disponível para adoção.</p>
        )}

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <AdoptionCard key={listing.id} listing={listing} />
          ))}
        </ul>
      </PageWrapper>
    </AppShell>
  )
}
