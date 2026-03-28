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
import type { OrganizationFormSubmitData } from '@/modules/organization/components/OrganizationForm'

export default function OrganizationFormPage() {
  const navigate = useNavigate()
  const { isLoading, createOrganization } = useOrganization()

  const handleSubmit = async (data: OrganizationFormSubmitData) => {
    await createOrganization({
      ...data,
      cnpj: data.cnpj || null,
    })
    navigate(ROUTES.ORGANIZATION.LIST)
  }

  return (
    <AppShell>
      <Header title="Nova Organização" showBack />
      <PageWrapper>
        <OrganizationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </PageWrapper>
    </AppShell>
  )
}
