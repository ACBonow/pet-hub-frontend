/**
 * @module adoption
 * @file AdoptionEditPage.tsx
 * @description Private page for editing an existing adoption listing.
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import AdoptionEditForm from '@/modules/adoption/components/AdoptionEditForm'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import type { UpdateAdoptionData } from '@/modules/adoption/types'

export default function AdoptionEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { listing, isLoading, getAdoption, updateAdoption } = useAdoption()

  useEffect(() => {
    if (id) getAdoption(id)
  }, [id])

  const handleSubmit = async (data: UpdateAdoptionData) => {
    if (!id) return
    await updateAdoption(id, data)
    navigate(ROUTES.ADOPTION.DETAIL(id))
  }

  return (
    <AppShell>
      <Header title="Editar Anúncio" showBack />
      <PageWrapper>
        {isLoading && !listing && (
          <p className="text-sm text-gray-500">Carregando...</p>
        )}
        {listing && (
          <AdoptionEditForm
            key={listing.id}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            defaultValues={{
              description: listing.description ?? '',
              contactEmail: listing.contactEmail ?? '',
              contactPhone: listing.contactPhone ?? '',
              contactWhatsapp: listing.contactWhatsapp ?? '',
            }}
          />
        )}
      </PageWrapper>
    </AppShell>
  )
}
