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

export default function AdoptionFormPage() {
  const navigate = useNavigate()
  const { isLoading, createAdoption } = useAdoption()

  const handleSubmit = async (data: CreateAdoptionData) => {
    await createAdoption(data)
    navigate(ROUTES.ADOPTION.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Anúncio" />
      <PageWrapper>
        <AdoptionForm onSubmit={handleSubmit} isLoading={isLoading} />
      </PageWrapper>
    </AppShell>
  )
}
