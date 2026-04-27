import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import AdoptionCard from '@/modules/adoption/components/AdoptionCard'
import AdoptionFiltersBar from '@/modules/adoption/components/AdoptionFilters'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'
import Pagination from '@/shared/components/ui/Pagination'
import Icon from '@/shared/components/ui/Icon'
import type { AdoptionFilters } from '@/modules/adoption/types'

const PAGE_SIZE = 12

export default function AdoptionListPage() {
  const { listings, isLoading, error, currentPage, totalPages, listAdoptions } = useAdoption()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<AdoptionFilters>({})

  useEffect(() => {
    listAdoptions({ ...filters, pageSize: PAGE_SIZE })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters: AdoptionFilters) => {
    setFilters(newFilters)
    listAdoptions({ ...newFilters, page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    listAdoptions({ ...filters, page, pageSize: PAGE_SIZE })
  }

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-fraunces font-black text-4xl text-ink tracking-tight leading-tight">
              Adoção
            </h1>
            <p className="text-sm text-muted mt-1.5">
              Pets à espera de um lar — encontre o seu companheiro.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to={ROUTES.ADOPTION.CREATE}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-green text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="plus" size={14} color="#fff" /> Novo anúncio
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card border border-line rounded-2xl p-4 mb-6">
          <AdoptionFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* States */}
        {isLoading && (
          <p className="text-sm text-muted">Carregando...</p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red">{error}</p>
        )}
        {!isLoading && !error && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-soft flex items-center justify-center mx-auto mb-4">
              <Icon name="heart" size={32} color="var(--muted)" />
            </div>
            <p className="text-body font-semibold">Nenhum pet disponível para adoção.</p>
            <p className="text-sm text-muted mt-1">Volte em breve — novos pets chegam todo dia.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && listings.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <AdoptionCard key={listing.id} listing={listing} />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPrev={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
            />
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
