/**
 * @module services-directory
 * @file ServiceFormPage.tsx
 * @description Private page for creating or editing a service listing.
 * When :id param is present, operates in edit mode.
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const navigate = useNavigate()
  const { isLoading, service, serviceTypes, createService, updateService, getService, listServiceTypes, uploadServicePhoto } = useServicesDirectory()
  const { context } = useActingAs()

  useEffect(() => {
    listServiceTypes()
  }, [listServiceTypes])

  useEffect(() => {
    if (id) getService(id)
  }, [id])

  const handleSubmit = async (data: CreateServiceData & { photoFile?: File | null }) => {
    const { photoFile, ...serviceData } = data

    if (isEditMode && id) {
      const result = await updateService(id, serviceData)
      if (result) {
        if (photoFile) {
          const photo = await compressImage(photoFile)
          await uploadServicePhoto(result.id, photo)
        }
        navigate(ROUTES.SERVICES.DETAIL(result.id))
      }
    } else {
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
  }

  const defaultValues = service && isEditMode
    ? {
        name: service.name,
        type: service.serviceType.code,
        description: service.description ?? '',
        zipCode: service.zipCode ?? '',
        street: service.street ?? '',
        number: service.number ?? '',
        complement: service.complement ?? '',
        neighborhood: service.neighborhood ?? '',
        city: service.city ?? '',
        state: service.state ?? '',
        phone: service.phone ?? '',
        whatsapp: service.whatsapp ?? '',
        email: service.email ?? '',
        website: service.website ?? '',
        instagram: service.instagram ?? '',
        facebook: service.facebook ?? '',
        tiktok: service.tiktok ?? '',
        youtube: service.youtube ?? '',
        googleMapsUrl: service.googleMapsUrl ?? '',
        googleBusinessUrl: service.googleBusinessUrl ?? '',
      }
    : undefined

  return (
    <AppShell>
      <Header title={isEditMode ? 'Editar Serviço' : 'Cadastrar Serviço'} showBack />
      <PageWrapper>
        <div className="flex flex-col gap-4">
          {!isEditMode && <ActingAsSelector />}
          {isEditMode && isLoading && !service && (
            <p className="text-sm text-gray-500">Carregando...</p>
          )}
          {(!isEditMode || service) && (
            <ServiceForm
              key={service?.id ?? 'new'}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              serviceTypes={serviceTypes}
              defaultValues={defaultValues}
              submitLabel={isEditMode ? 'Salvar alterações' : undefined}
            />
          )}
        </div>
      </PageWrapper>
    </AppShell>
  )
}
