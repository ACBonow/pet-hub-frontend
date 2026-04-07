/**
 * @module services-directory
 * @file ServicesListPage.tsx
 * @description Public page listing pet services with search and filter.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import ServiceCard from '@/modules/services-directory/components/ServiceCard'
import ServiceFiltersBar from '@/modules/services-directory/components/ServiceFilters'
import { ROUTES } from '@/routes/routes.config'
import Pagination from '@/shared/components/ui/Pagination'
import type { ServiceFilters } from '@/modules/services-directory/types'

const DEBOUNCE_MS = 400
const PAGE_SIZE = 12

export default function ServicesListPage() {
  const { services, serviceTypes, isLoading, error, currentPage, totalPages, listServices, listServiceTypes } = useServicesDirectory()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<ServiceFilters>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    listServices({ ...filters, pageSize: PAGE_SIZE })
    listServiceTypes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTypeChange(type: string | undefined) {
    const next: ServiceFilters = { ...filters, type, page: 1, pageSize: PAGE_SIZE }
    if (!type) delete next.type
    setFilters({ ...filters, type })
    listServices(next)
  }

  function handleNameChange(name: string) {
    const next: ServiceFilters = { ...filters, name: name || undefined, page: 1, pageSize: PAGE_SIZE }
    if (!name) delete next.name
    setFilters({ ...filters, name: name || undefined })

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      listServices(next)
    }, DEBOUNCE_MS)
  }

  function handlePageChange(page: number) {
    listServices({ ...filters, page, pageSize: PAGE_SIZE })
  }

  return (
    <PublicLayout>
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">🏥 Serviços</h1>
          {isAuthenticated && (
            <Link
              to={ROUTES.SERVICES.CREATE}
              className="text-sm font-medium text-[--color-primary] hover:underline"
            >
              + Cadastrar
            </Link>
          )}
        </div>
        <ServiceFiltersBar
          filters={filters}
          serviceTypes={serviceTypes}
          onNameChange={handleNameChange}
          onTypeChange={handleTypeChange}
        />
      </header>

      <main className="px-4 py-4 pb-24 max-w-2xl mx-auto">
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

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPrev={() => handlePageChange(currentPage - 1)}
            onNext={() => handlePageChange(currentPage + 1)}
          />
        )}
      </main>
    </PublicLayout>
  )
}
