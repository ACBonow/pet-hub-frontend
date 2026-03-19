/**
 * @module lost-found
 * @file LostFoundFormPage.tsx
 * @description Page for creating a new lost or found report.
 */

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import LostFoundForm from '@/modules/lost-found/components/LostFoundForm'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import type { CreateLostFoundData } from '@/modules/lost-found/types'

export default function LostFoundFormPage() {
  const navigate = useNavigate()
  const { isLoading, createReport } = useLostFound()

  const handleSubmit = async (data: CreateLostFoundData) => {
    await createReport(data)
    navigate(ROUTES.LOST_FOUND.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Relatório" />
      <PageWrapper>
        <LostFoundForm onSubmit={handleSubmit} isLoading={isLoading} />
      </PageWrapper>
    </AppShell>
  )
}
