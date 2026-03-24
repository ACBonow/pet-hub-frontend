/**
 * @module organization
 * @file OrganizationFormPage.tsx
 * @description Page for creating a new organization.
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import OrganizationForm from '@/modules/organization/components/OrganizationForm'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'


export default function OrganizationFormPage() {
  const navigate = useNavigate()
  const { isLoading, createOrganization } = useOrganization()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    await createOrganization({
      ...data,
      cnpj: data.cnpj || null,
      responsiblePersonIds: [],
    })
    navigate(ROUTES.ORGANIZATION.LIST)
  }

  return (
    <AppShell>
      <Header title="Nova Organização" />
      <PageWrapper>
        <OrganizationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </PageWrapper>
    </AppShell>
  )
}
