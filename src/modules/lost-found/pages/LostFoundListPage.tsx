/**
 * @module lost-found
 * @file LostFoundListPage.tsx
 * @description Public page listing lost and found reports with filters.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import LostFoundCard from '@/modules/lost-found/components/LostFoundCard'
import LostFoundFiltersBar from '@/modules/lost-found/components/LostFoundFilters'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import Pagination from '@/shared/components/ui/Pagination'
import type { LostFoundFilters } from '@/modules/lost-found/types'

const PAGE_SIZE = 12

export default function LostFoundListPage() {
  const { reports, isLoading, error, currentPage, totalPages, listReports } = useLostFound()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<LostFoundFilters>({})

  useEffect(() => {
    listReports({ ...filters, pageSize: PAGE_SIZE })
  }, [])

  const handleFiltersChange = (newFilters: LostFoundFilters) => {
    setFilters(newFilters)
    listReports({ ...newFilters, page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    listReports({ ...filters, page, pageSize: PAGE_SIZE })
  }

  return (
    <PublicLayout>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">🔍 Achados e Perdidos</h1>
      </header>
      <PageWrapper>
        {isAuthenticated && (
          <div className="flex justify-end mb-4">
            <Link
              to={ROUTES.LOST_FOUND.CREATE}
              className="text-sm font-medium text-[--color-primary] hover:underline"
            >
              + Novo relatório
            </Link>
          </div>
        )}

        <LostFoundFiltersBar filters={filters} onChange={handleFiltersChange} />

        {isLoading && <p className="text-sm text-gray-500 mt-4">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger] mt-4">{error}</p>}

        {!isLoading && !error && reports.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">Nenhum relatório encontrado.</p>
        )}

        <ul className="mt-4 flex flex-col gap-3">
          {reports.map((report) => (
            <LostFoundCard key={report.id} report={report} />
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
