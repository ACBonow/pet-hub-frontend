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
import ActingAsSelector from '@/shared/components/ui/ActingAsSelector'
import { useActingAs } from '@/shared/hooks/useActingAs'

export default function LostFoundFormPage() {
  const navigate = useNavigate()
  const { isLoading, createReport, uploadPhoto } = useLostFound()
  const { context } = useActingAs()

  const handleSubmit = async (data: LostFoundFormSubmitData) => {
    const report = await createReport({
      ...data,
      organizationId: context.type === 'org' ? context.organizationId ?? null : null,
    })
    if (data.photoFile) {
      await uploadPhoto(report.id, data.photoFile)
    }
    navigate(ROUTES.LOST_FOUND.LIST)
  }

  return (
    <AppShell>
      <Header title="Novo Relatório" showBack />
      <PageWrapper>
        <div className="flex flex-col gap-4">
          <ActingAsSelector />
          <LostFoundForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </PageWrapper>
    </AppShell>
  )
}
