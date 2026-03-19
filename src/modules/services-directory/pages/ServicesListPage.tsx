/**
 * @module services-directory
 * @file ServicesListPage.tsx
 * @description Public page listing pet services with search and filter.
 */

import { useEffect, useRef, useState } from 'react'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import ServiceCard from '@/modules/services-directory/components/ServiceCard'
import ServiceFiltersBar from '@/modules/services-directory/components/ServiceFilters'
import type { ServiceType, ServiceFilters } from '@/modules/services-directory/types'

const DEBOUNCE_MS = 400

export default function ServicesListPage() {
  const { services, isLoading, error, listServices } = useServicesDirectory()
  const [filters, setFilters] = useState<ServiceFilters>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    listServices(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTypeChange(type: ServiceType | undefined) {
    const next = { ...filters, type }
    if (!type) delete next.type
    setFilters(next)
    listServices(next)
  }

  function handleNameChange(name: string) {
    const next = { ...filters, name: name || undefined }
    if (!name) delete next.name
    setFilters(next)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      listServices(next)
    }, DEBOUNCE_MS)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Serviços</h1>
        <ServiceFiltersBar
          filters={filters}
          onNameChange={handleNameChange}
          onTypeChange={handleTypeChange}
        />
      </header>

      <main className="px-4 py-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div
              className="animate-spin w-8 h-8 border-4 border-[--color-primary] border-t-transparent rounded-full"
              aria-label="Carregando"
            />
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 py-8">{error}</p>
        )}

        {!isLoading && !error && services.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum serviço encontrado.</p>
        )}

        {!isLoading && services.length > 0 && (
          <ul className="space-y-3" aria-label="Lista de serviços">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
