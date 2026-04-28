import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import LostFoundCard from '@/modules/lost-found/components/LostFoundCard'
import LostFoundFiltersBar from '@/modules/lost-found/components/LostFoundFilters'
import LostFoundMap from '@/modules/lost-found/components/LostFoundMap'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import Pagination from '@/shared/components/ui/Pagination'
import Icon from '@/shared/components/ui/Icon'
import type { LostFoundFilters } from '@/modules/lost-found/types'

const PAGE_SIZE = 12

export default function LostFoundListPage() {
  const { reports, isLoading, error, currentPage, totalPages, listReports } = useLostFound()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<LostFoundFilters>({})

  useEffect(() => {
    listReports({ ...filters, pageSize: PAGE_SIZE })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters: LostFoundFilters) => {
    setFilters(newFilters)
    listReports({ ...newFilters, page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    listReports({ ...filters, page, pageSize: PAGE_SIZE })
  }

  const lostCount = reports.filter((r) => r.type === 'LOST').length
  const foundCount = reports.filter((r) => r.type === 'FOUND').length

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-fraunces font-black text-4xl text-ink tracking-tight leading-tight">
              Perdidos &amp; Achados
            </h1>
            <p className="text-sm text-muted mt-1.5">
              Ajude a galera a reencontrar os pets da sua cidade.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to={ROUTES.LOST_FOUND.CREATE}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="plus" size={14} color="#fff" /> Reportar pet
            </Link>
          )}
        </div>

        {/* Map */}
        <LostFoundMap reports={reports} lostCount={lostCount} foundCount={foundCount} />

        {/* Filters */}
        <div className="bg-card border border-line rounded-2xl p-4 mb-6">
          <LostFoundFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* States */}
        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}
        {!isLoading && !error && reports.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-soft flex items-center justify-center mx-auto mb-4">
              <Icon name="search" size={32} color="var(--muted)" />
            </div>
            <p className="text-body font-semibold">Nenhum relatório encontrado.</p>
            <p className="text-sm text-muted mt-1">Tente ajustar os filtros.</p>
          </div>
        )}

        {/* List */}
        <ul className="flex flex-col gap-3">
          {reports.map((report) => (
            <LostFoundCard key={report.id} report={report} />
          ))}
        </ul>

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
