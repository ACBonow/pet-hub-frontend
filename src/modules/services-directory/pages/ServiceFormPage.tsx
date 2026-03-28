/**
 * @module services-directory
 * @file ServiceFormPage.tsx
 * @description Private page for creating a new service listing.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import ServiceForm from '@/modules/services-directory/components/ServiceForm'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import type { CreateServiceData } from '@/modules/services-directory/types'

export default function ServiceFormPage() {
  const navigate = useNavigate()
  const { isLoading, serviceTypes, createService, listServiceTypes } = useServicesDirectory()

  useEffect(() => {
    listServiceTypes()
  }, [listServiceTypes])

  const handleSubmit = async (data: CreateServiceData) => {
    const result = await createService(data)
    if (result) {
      navigate(ROUTES.SERVICES.DETAIL(result.id))
    }
  }

  return (
    <AppShell>
      <Header title="Cadastrar Serviço" showBack />
      <PageWrapper>
        <ServiceForm onSubmit={handleSubmit} isLoading={isLoading} serviceTypes={serviceTypes} />
      </PageWrapper>
    </AppShell>
  )
}
