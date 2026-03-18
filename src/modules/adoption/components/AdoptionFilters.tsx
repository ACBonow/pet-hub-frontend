/**
 * @module adoption
 * @file AdoptionFilters.tsx
 * @description Filter bar for adoption listings.
 */

import type { AdoptionFilters } from '@/modules/adoption/types'

interface AdoptionFiltersProps {
  filters: AdoptionFilters
  onChange: (filters: AdoptionFilters) => void
}

export default function AdoptionFiltersBar({ filters, onChange }: AdoptionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="filter-species" className="text-sm font-medium text-gray-700">
          Espécie
        </label>
        <select
          id="filter-species"
          value={filters.species ?? ''}
          onChange={(e) => onChange({ ...filters, species: e.target.value || undefined })}
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        >
          <option value="">Todas</option>
          <option value="dog">Cão</option>
          <option value="cat">Gato</option>
          <option value="bird">Ave</option>
          <option value="rabbit">Coelho</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="filter-status" className="text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="filter-status"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              status: (e.target.value as AdoptionFilters['status']) || undefined,
            })
          }
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        >
          <option value="">Todos</option>
          <option value="AVAILABLE">Disponível</option>
          <option value="RESERVED">Reservado</option>
          <option value="ADOPTED">Adotado</option>
        </select>
      </div>
    </div>
  )
}
