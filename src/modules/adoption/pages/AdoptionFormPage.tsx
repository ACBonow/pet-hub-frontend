/**
 * @module adoption
 * @file AdoptionFormPage.tsx
 * @description Page for creating a new adoption listing.
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import AdoptionForm from '@/modules/adoption/components/AdoptionForm'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import type { CreateAdoptionData } from '@/modules/adoption/types'
import ActingAsSelector from '@/shared/components/ui/ActingAsSelector'
import { useActingAs } from '@/shared/hooks/useActingAs'

export default function AdoptionFormPage() {
  const navigate = useNavigate()
  const { isLoading, createAdoption } = useAdoption()
  const { context } = useActingAs()

  const handleSubmit = async (data: CreateAdoptionData) => {
    await createAdoption({
      ...data,
      organizationId: context.type === 'org' ? context.organizationId ?? null : null,
    })
    navigate(ROUTES.ADOPTION.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Anúncio" showBack />
      <PageWrapper>
        <div className="flex flex-col gap-4">
          <ActingAsSelector />
          <AdoptionForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </PageWrapper>
    </AppShell>
  )
}
