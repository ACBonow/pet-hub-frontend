/**
 * @module lost-found
 * @file LostFoundListPage.tsx
 * @description Public page listing lost and found reports with filters.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import LostFoundCard from '@/modules/lost-found/components/LostFoundCard'
import LostFoundFiltersBar from '@/modules/lost-found/components/LostFoundFilters'
import type { LostFoundFilters } from '@/modules/lost-found/types'

export default function LostFoundListPage() {
  const { reports, isLoading, error, listReports } = useLostFound()
  const [filters, setFilters] = useState<LostFoundFilters>({})

  useEffect(() => {
    listReports(filters)
  }, [])

  const handleFiltersChange = (newFilters: LostFoundFilters) => {
    setFilters(newFilters)
    listReports(newFilters)
  }

  return (
    <AppShell>
      <Header title="Achados e Perdidos" />
      <PageWrapper>
        <div className="flex justify-end mb-4">
          <Link
            to={ROUTES.LOST_FOUND.CREATE}
            className="text-sm font-medium text-[--color-primary] hover:underline"
          >
            + Novo relatório
          </Link>
        </div>

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
      </PageWrapper>
    </AppShell>
  )
}
