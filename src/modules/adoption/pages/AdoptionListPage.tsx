/**
 * @module adoption
 * @file AdoptionListPage.tsx
 * @description Public page listing pets available for adoption with filters.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import AdoptionCard from '@/modules/adoption/components/AdoptionCard'
import AdoptionFiltersBar from '@/modules/adoption/components/AdoptionFilters'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'
import Pagination from '@/shared/components/ui/Pagination'
import type { AdoptionFilters } from '@/modules/adoption/types'

const PAGE_SIZE = 12

export default function AdoptionListPage() {
  const { listings, isLoading, error, currentPage, totalPages, listAdoptions } = useAdoption()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<AdoptionFilters>({})

  useEffect(() => {
    listAdoptions({ ...filters, pageSize: PAGE_SIZE })
  }, [])

  const handleFiltersChange = (newFilters: AdoptionFilters) => {
    setFilters(newFilters)
    listAdoptions({ ...newFilters, page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    listAdoptions({ ...filters, page, pageSize: PAGE_SIZE })
  }

  return (
    <PublicLayout>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">❤️ Adoção</h1>
          {isAuthenticated && (
            <Link
              to={ROUTES.ADOPTION.CREATE}
              className="text-sm font-medium text-[--color-primary] hover:underline"
            >
              + Novo anúncio
            </Link>
          )}
        </div>
      </header>
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

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPrev={() => handlePageChange(currentPage - 1)}
            onNext={() => handlePageChange(currentPage + 1)}
          />
        )}
      </PageWrapper>
    </PublicLayout>
  )
}
