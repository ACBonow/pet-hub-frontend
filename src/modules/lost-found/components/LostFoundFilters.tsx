/**
 * @module lost-found
 * @file LostFoundFilters.tsx
 * @description Filter bar for lost & found reports.
 */

import type { LostFoundFilters } from '@/modules/lost-found/types'

interface LostFoundFiltersProps {
  filters: LostFoundFilters
  onChange: (filters: LostFoundFilters) => void
}

export default function LostFoundFiltersBar({ filters, onChange }: LostFoundFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="filter-type" className="text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          id="filter-type"
          value={filters.type ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              type: (e.target.value as LostFoundFilters['type']) || undefined,
            })
          }
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        >
          <option value="">Todos</option>
          <option value="LOST">Perdido</option>
          <option value="FOUND">Achado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="filter-status-lf" className="text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="filter-status-lf"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              status: (e.target.value as LostFoundFilters['status']) || undefined,
            })
          }
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        >
          <option value="">Todos</option>
          <option value="OPEN">Aberto</option>
          <option value="RESOLVED">Resolvido</option>
        </select>
      </div>
    </div>
  )
}
