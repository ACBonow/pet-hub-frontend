/**
 * @module services-directory
 * @file ServiceFilters.tsx
 * @description Filter bar for the services directory listing.
 */

import { SERVICE_TYPE_LABELS } from '@/modules/services-directory/types'
import type { ServiceType, ServiceFilters } from '@/modules/services-directory/types'

interface ServiceFiltersProps {
  filters: ServiceFilters
  onNameChange: (name: string) => void
  onTypeChange: (type: ServiceType | undefined) => void
}

const SERVICE_TYPES = Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]

export default function ServiceFiltersBar({
  filters,
  onNameChange,
  onTypeChange,
}: ServiceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="service-search" className="sr-only">
          Buscar por nome
        </label>
        <input
          id="service-search"
          type="search"
          placeholder="Buscar serviço..."
          value={filters.name ?? ''}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="service-type-filter" className="sr-only">
          Tipo
        </label>
        <select
          id="service-type-filter"
          aria-label="Tipo"
          value={filters.type ?? ''}
          onChange={(e) =>
            onTypeChange(e.target.value ? (e.target.value as ServiceType) : undefined)
          }
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
        >
          <option value="">Todos os tipos</option>
          {SERVICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {SERVICE_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
