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
import type { LostFoundFormSubmitData } from '@/modules/lost-found/components/LostFoundForm'

export default function LostFoundFormPage() {
  const navigate = useNavigate()
  const { isLoading, createReport, uploadPhoto } = useLostFound()

  const handleSubmit = async (data: LostFoundFormSubmitData) => {
    const report = await createReport(data)
    if (data.photoFile) {
      await uploadPhoto(report.id, data.photoFile)
    }
    navigate(ROUTES.LOST_FOUND.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Relatório" showBack />
      <PageWrapper>
        <LostFoundForm onSubmit={handleSubmit} isLoading={isLoading} />
      </PageWrapper>
    </AppShell>
  )
}
