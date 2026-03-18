/**
 * @module organization
 * @file OrganizationListPage.tsx
 * @description Page for listing all organizations.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import OrganizationCard from '@/modules/organization/components/OrganizationCard'

export default function OrganizationListPage() {
  const { organizations, isLoading, error, listOrganizations } = useOrganization()

  useEffect(() => {
    listOrganizations()
  }, [])

  return (
    <AppShell>
      <Header title="Organizações" />
      <PageWrapper>
        <div className="flex justify-end mb-4">
          <Link
            to={ROUTES.ORGANIZATION.CREATE}
            className="text-sm font-medium text-[--color-primary] hover:underline"
          >
            + Nova organização
          </Link>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {!isLoading && !error && organizations.length === 0 && (
          <p className="text-sm text-gray-500">Nenhuma organização encontrada.</p>
        )}

        <ul className="flex flex-col gap-3">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </ul>
      </PageWrapper>
    </AppShell>
  )
}
