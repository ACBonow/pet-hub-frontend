import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import LostFoundCard from '@/modules/lost-found/components/LostFoundCard'
import LostFoundFiltersBar from '@/modules/lost-found/components/LostFoundFilters'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import Pagination from '@/shared/components/ui/Pagination'
import Icon from '@/shared/components/ui/Icon'
import type { LostFoundFilters } from '@/modules/lost-found/types'

const PAGE_SIZE = 12

/* Decorative map pins for the mock map */
const MAP_PINS = [
  { x: '12%', y: 45, lost: true },
  { x: '28%', y: 115, lost: true },
  { x: '44%', y: 72, lost: false },
  { x: '58%', y: 155, lost: true },
  { x: '70%', y: 95, lost: false },
  { x: '83%', y: 55, lost: true },
  { x: '18%', y: 175, lost: false },
  { x: '52%', y: 195, lost: true },
]

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

        {/* Map mock */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6 border border-line"
          style={{ height: 240, background: 'linear-gradient(135deg, var(--green-light) 0%, var(--soft) 100%)' }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={28 + i * 24} x2="100%" y2={28 + i * 24}
                stroke="var(--line-strong)" strokeWidth="1" opacity="0.4" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`v${i}`} x1={40 + i * 60} y1="0" x2={40 + i * 60} y2="100%"
                stroke="var(--line-strong)" strokeWidth="1" opacity="0.4" />
            ))}
          </svg>

          {/* Pins */}
          {MAP_PINS.map((pin, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center rounded-full border-2 border-white shadow-md"
              style={{
                left: pin.x, top: pin.y,
                width: 28, height: 28,
                background: pin.lost ? 'var(--red)' : 'var(--green)',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Icon name="paw" size={12} color="#fff" />
            </div>
          ))}

          {/* Location badge */}
          <div className="absolute top-3 left-3 bg-card rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-line">
            <Icon name="pin" size={13} color="var(--green)" /> Sua região
          </div>

          {/* Legend */}
          <div className="absolute top-3 right-3 bg-card rounded-xl px-3 py-2 shadow-sm border border-line flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--red)' }} />
              <span className="text-body">Perdidos ({lostCount})</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green)' }} />
              <span className="text-body">Achados ({foundCount})</span>
            </div>
          </div>
        </div>

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
