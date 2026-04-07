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

import ActingAsSelector from '@/shared/components/ui/ActingAsSelector'
import { useActingAs } from '@/shared/hooks/useActingAs'
import { compressImage } from '@/shared/utils/image'

export default function ServiceFormPage() {
  const navigate = useNavigate()
  const { isLoading, serviceTypes, createService, listServiceTypes, uploadServicePhoto } = useServicesDirectory()
  const { context } = useActingAs()

  useEffect(() => {
    listServiceTypes()
  }, [listServiceTypes])

  const handleSubmit = async (data: CreateServiceData & { photoFile?: File | null }) => {
    const { photoFile, ...serviceData } = data
    const result = await createService({
      ...serviceData,
      organizationId: context.type === 'org' ? context.organizationId ?? undefined : undefined,
    })
    if (result) {
      if (photoFile) {
        const photo = await compressImage(photoFile)
        await uploadServicePhoto(result.id, photo)
      }
      navigate(ROUTES.SERVICES.DETAIL(result.id))
    }
  }

  return (
    <AppShell>
      <Header title="Cadastrar Serviço" showBack />
      <PageWrapper>
        <div className="flex flex-col gap-4">
          <ActingAsSelector />
          <ServiceForm onSubmit={handleSubmit} isLoading={isLoading} serviceTypes={serviceTypes} />
        </div>
      </PageWrapper>
    </AppShell>
  )
}
