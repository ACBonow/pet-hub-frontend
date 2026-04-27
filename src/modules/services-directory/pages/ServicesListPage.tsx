import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import ServiceCard from '@/modules/services-directory/components/ServiceCard'
import ServiceFiltersBar from '@/modules/services-directory/components/ServiceFilters'
import { ROUTES } from '@/routes/routes.config'
import Pagination from '@/shared/components/ui/Pagination'
import Icon from '@/shared/components/ui/Icon'
import type { ServiceFilters } from '@/modules/services-directory/types'

const DEBOUNCE_MS = 400
const PAGE_SIZE = 12

const CATEGORY_ICONS: Record<string, 'paw' | 'stethoscope' | 'scissors' | 'walk' | 'building' | 'cart'> = {
  CLINIC: 'stethoscope',
  GROOMING: 'scissors',
  WALKER: 'walk',
  HOTEL: 'building',
  SHOP: 'cart',
}

export default function ServicesListPage() {
  const { services, serviceTypes, isLoading, error, currentPage, totalPages, listServices, listServiceTypes } = useServicesDirectory()
  const { isAuthenticated } = useAuthStore()
  const [filters, setFilters] = useState<ServiceFilters>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    listServices({ ...filters, pageSize: PAGE_SIZE })
    listServiceTypes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    debounceRef.current = setTimeout(() => listServices(next), DEBOUNCE_MS)
  }

  function handlePageChange(page: number) {
    listServices({ ...filters, page, pageSize: PAGE_SIZE })
  }

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-fraunces font-black text-4xl text-ink tracking-tight leading-tight">
              Marketplace
            </h1>
            <p className="text-sm text-muted mt-1.5">
              Clínicas, pet shops, passeadores e hotéis verificados pertinho de ti.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to={ROUTES.SERVICES.CREATE}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm border border-line text-body hover:bg-soft transition-colors"
            >
              <Icon name="plus" size={14} color="currentColor" /> Cadastrar serviço
            </Link>
          )}
        </div>

        {/* Category pills */}
        {serviceTypes.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto pb-1">
            <button
              onClick={() => handleTypeChange(undefined)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border whitespace-nowrap transition-colors ${
                !filters.type
                  ? 'bg-green text-white border-green'
                  : 'bg-card border-line text-body hover:bg-soft'
              }`}
            >
              <Icon name="paw" size={14} color={!filters.type ? '#fff' : 'currentColor'} />
              Todos
            </button>
            {serviceTypes.map((t) => {
              const isActive = filters.type === t.code
              const iconName = CATEGORY_ICONS[t.code] ?? 'stethoscope'
              return (
                <button
                  key={t.code}
                  onClick={() => handleTypeChange(t.code)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-green text-white border-green'
                      : 'bg-card border-line text-body hover:bg-soft'
                  }`}
                >
                  <Icon name={iconName} size={14} color={isActive ? '#fff' : 'currentColor'} />
                  {t.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Filters (keeps aria-label="Tipo" select for tests) */}
        <div className="bg-card border border-line rounded-2xl p-4 mb-6">
          <ServiceFiltersBar
            filters={filters}
            serviceTypes={serviceTypes}
            onNameChange={handleNameChange}
            onTypeChange={handleTypeChange}
          />
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-green border-t-transparent rounded-full" aria-label="Carregando" />
          </div>
        )}
        {error && <p className="text-sm text-red py-4">{error}</p>}
        {!isLoading && !error && services.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-soft flex items-center justify-center mx-auto mb-4">
              <Icon name="stethoscope" size={32} color="var(--muted)" />
            </div>
            <p className="text-body font-semibold">Nenhum serviço encontrado.</p>
            <p className="text-sm text-muted mt-1">Tente outros filtros ou cadastre o seu.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && services.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Lista de serviços">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} />
              </li>
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
