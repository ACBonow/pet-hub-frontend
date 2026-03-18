/**
 * @module organization
 * @file OrganizationDetailPage.tsx
 * @description Page for viewing organization details.
 */

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import { applyCnpjMask } from '@/shared/utils/mask'

const TYPE_LABELS: Record<string, string> = {
  COMPANY: 'Empresa',
  NGO: 'ONG',
}

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { organization, isLoading, error, getOrganization } = useOrganization()

  useEffect(() => {
    if (id) getOrganization(id)
  }, [id])

  return (
    <AppShell>
      <Header title="Organização" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {organization && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-xl font-bold text-gray-900">{organization.name}</p>
              <p className="text-sm text-gray-500">{TYPE_LABELS[organization.type]}</p>
              {organization.cnpj && (
                <p className="text-sm text-gray-500 mt-1">
                  CNPJ: {applyCnpjMask(organization.cnpj)}
                </p>
              )}
              {organization.email && (
                <p className="text-sm text-gray-500">{organization.email}</p>
              )}
              {organization.phone && (
                <p className="text-sm text-gray-500">{organization.phone}</p>
              )}
              {organization.description && (
                <p className="text-sm text-gray-700 mt-2">{organization.description}</p>
              )}
            </div>

            <Link
              to={ROUTES.ORGANIZATION.EDIT(organization.id)}
              className="text-sm font-medium text-[--color-primary] hover:underline"
            >
              Editar organização
            </Link>
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
