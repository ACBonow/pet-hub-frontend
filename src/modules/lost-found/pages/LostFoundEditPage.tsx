/**
 * @module lost-found
 * @file LostFoundEditPage.tsx
 * @description Private page for editing an existing lost or found report.
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import LostFoundEditForm from '@/modules/lost-found/components/LostFoundEditForm'
import { useLostFound } from '@/modules/lost-found/hooks/useLostFound'
import type { UpdateLostFoundData } from '@/modules/lost-found/types'

export default function LostFoundEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { report, isLoading, getReport, updateReport } = useLostFound()

  useEffect(() => {
    if (id) getReport(id)
  }, [id])

  const handleSubmit = async (data: UpdateLostFoundData) => {
    if (!id) return
    await updateReport(id, data)
    navigate(ROUTES.LOST_FOUND.DETAIL(id))
  }

  return (
    <AppShell>
      <Header title="Editar Relatório" showBack />
      <PageWrapper>
        {isLoading && !report && (
          <p className="text-sm text-gray-500">Carregando...</p>
        )}
        {report && (
          <LostFoundEditForm
            key={report.id}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            defaultValues={{
              petName: report.petName ?? '',
              species: report.species ?? '',
              description: report.description,
              addressStreet: report.addressStreet ?? '',
              addressNumber: report.addressNumber ?? '',
              addressNeighborhood: report.addressNeighborhood ?? '',
              addressCep: report.addressCep ?? '',
              addressCity: report.addressCity ?? '',
              addressState: report.addressState ?? '',
              addressNotes: report.addressNotes ?? '',
              contactEmail: report.contactEmail ?? '',
              contactPhone: report.contactPhone ?? '',
            }}
          />
        )}
      </PageWrapper>
    </AppShell>
  )
}
