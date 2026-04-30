/**
 * @module organization
 * @file pages/OrganizationDashboardPage.tsx
 * @description Private dashboard page for managing an organization, with tabs for data, members, and resources.
 */

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import { useOrgResources } from '@/modules/organization/hooks/useOrgResources'
import OrgDataTab from '@/modules/organization/components/OrgDataTab'
import OrgResourceTab from '@/modules/organization/components/OrgResourceTab'
import PetCard from '@/modules/pet/components/PetCard'
import type { OrgRole } from '@/modules/organization/types'

type TabKey = 'dados' | 'membros' | 'pets' | 'adocoes' | 'achados-perdidos' | 'servicos'

const ALL_TABS: Array<{ key: TabKey; label: string; ownerOnly?: boolean }> = [
  { key: 'dados', label: 'Dados' },
  { key: 'membros', label: 'Membros', ownerOnly: true },
  { key: 'pets', label: 'Pets' },
  { key: 'adocoes', label: 'Adoções' },
  { key: 'achados-perdidos', label: 'Achados/Perdidos' },
  { key: 'servicos', label: 'Serviços' },
]

export default function OrganizationDashboardPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') ?? 'dados') as TabKey

  const {
    organization,
    members,
    isLoading: orgLoading,
    error: orgError,
    getOrganization,
    getMembers,
  } = useOrganization()

  const {
    pets,
    adoptions,
    reports,
    services,
    isLoading: resourceLoading,
    error: resourceError,
    loadPets,
    loadAdoptions,
    loadReports,
    loadServices,
    deleteService,
  } = useOrgResources()

  const [confirmingDeleteServiceId, setConfirmingDeleteServiceId] = useState<string | null>(null)

  async function handleDeleteService(serviceId: string) {
    await deleteService(serviceId)
    setConfirmingDeleteServiceId(null)
  }

  const myRole = organization?.myRole as OrgRole | undefined
  const visibleTabs = ALL_TABS.filter(tab => !tab.ownerOnly || myRole === 'OWNER')

  useEffect(() => {
    if (id) {
      getOrganization(id)
      getMembers(id)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!id) return
    if (activeTab === 'pets') loadPets(id)
    else if (activeTab === 'adocoes') loadAdoptions(id)
    else if (activeTab === 'achados-perdidos') loadReports(id)
    else if (activeTab === 'servicos') loadServices(id)
  }, [activeTab, id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleTabClick(key: TabKey) {
    setSearchParams({ tab: key })
  }

  return (
    <AppShell>
      <Header title="Painel da Organização" showBack />
      <PageWrapper>
        {orgLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {orgError && <p role="alert" className="text-sm text-[--color-danger]">{orgError}</p>}

        {organization && (
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold text-gray-900">{organization.name}</p>

            {/* Tab bar */}
            <div role="tablist" className="flex gap-1 overflow-x-auto pb-1 border-b border-gray-200">
              {visibleTabs.map(tab => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-[--color-primary] border-b-2 border-[--color-primary]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div>
              {activeTab === 'dados' && (
                <OrgDataTab organization={organization} myRole={myRole} />
              )}

              {activeTab === 'membros' && myRole === 'OWNER' && (
                <div className="flex flex-col gap-2">
                  {members.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {members.map(member => (
                        <li key={member.personId} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-800">{member.name}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            {member.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhum membro cadastrado.</p>
                  )}
                </div>
              )}

              {activeTab === 'pets' && (
                <OrgResourceTab
                  isLoading={resourceLoading}
                  error={resourceError}
                  isEmpty={pets.length === 0}
                  emptyMessage="Nenhum pet cadastrado para esta organização."
                >
                  <ul className="flex flex-col gap-2">
                    {pets.map(pet => (
                      <PetCard key={pet.id} pet={pet} />
                    ))}
                  </ul>
                </OrgResourceTab>
              )}

              {activeTab === 'adocoes' && (
                <OrgResourceTab
                  isLoading={resourceLoading}
                  error={resourceError}
                  isEmpty={adoptions.length === 0}
                  emptyMessage="Nenhuma listagem de adoção para esta organização."
                >
                  {adoptions.map(adoption => (
                    <Link
                      key={adoption.id}
                      to={ROUTES.ADOPTION.DETAIL(adoption.id)}
                      className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 text-sm text-gray-800"
                    >
                      {adoption.petName}
                    </Link>
                  ))}
                </OrgResourceTab>
              )}

              {activeTab === 'achados-perdidos' && (
                <OrgResourceTab
                  isLoading={resourceLoading}
                  error={resourceError}
                  isEmpty={reports.length === 0}
                  emptyMessage="Nenhum relatório de achado/perdido para esta organização."
                >
                  {reports.map(report => (
                    <Link
                      key={report.id}
                      to={ROUTES.LOST_FOUND.DETAIL(report.id)}
                      className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 text-sm text-gray-800"
                    >
                      {report.petName ?? report.description}
                    </Link>
                  ))}
                </OrgResourceTab>
              )}

              {activeTab === 'servicos' && (
                <OrgResourceTab
                  isLoading={resourceLoading}
                  error={resourceError}
                  isEmpty={services.length === 0}
                  emptyMessage="Nenhum serviço cadastrado para esta organização."
                >
                  {services.map(service => (
                    <div key={service.id} className="flex flex-col gap-1 p-2 rounded border border-gray-200 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={ROUTES.SERVICES.DETAIL(service.id)}
                          className="text-gray-800 hover:underline truncate"
                        >
                          {service.name}
                        </Link>
                        {confirmingDeleteServiceId !== service.id && (
                          <button
                            type="button"
                            onClick={() => setConfirmingDeleteServiceId(service.id)}
                            className="text-xs text-red hover:underline shrink-0"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                      {confirmingDeleteServiceId === service.id && (
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                          <span className="text-xs text-gray-600">Confirmar exclusão?</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-xs font-medium text-white bg-red px-2 py-0.5 rounded"
                          >
                            Excluir
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingDeleteServiceId(null)}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </OrgResourceTab>
              )}
            </div>
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
