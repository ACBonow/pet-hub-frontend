/**
 * @module organization
 * @file OrganizationFormPage.tsx
 * @description Page for creating or editing an organization.
 * When :id param is present, operates in edit mode.
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import OrganizationForm from '@/modules/organization/components/OrganizationForm'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import type { OrganizationFormSubmitData } from '@/modules/organization/components/OrganizationForm'
import { compressImage } from '@/shared/utils/image'

export default function OrganizationFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const navigate = useNavigate()
  const { isLoading, organization, getOrganization, createOrganization, updateOrganization, uploadOrgPhoto } = useOrganization()

  useEffect(() => {
    if (id) getOrganization(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (data: OrganizationFormSubmitData) => {
    if (isEditMode && id) {
      await updateOrganization(id, {
        name: data.name,
        cnpj: data.cnpj || null,
        phone: data.phone,
        email: data.email,
        website: data.website,
        instagram: data.instagram,
        description: data.description,
        addressStreet: data.addressStreet,
        addressNumber: data.addressNumber,
        addressNeighborhood: data.addressNeighborhood,
        addressCep: data.addressCep,
        addressCity: data.addressCity,
        addressState: data.addressState,
      })
      if (data.photoFile) {
        const photo = await compressImage(data.photoFile)
        await uploadOrgPhoto(id, photo)
      }
      navigate(ROUTES.ORGANIZATION.DETAIL(id))
    } else {
      const org = await createOrganization({
        ...data,
        cnpj: data.cnpj || null,
      })
      if (data.photoFile) {
        const photo = await compressImage(data.photoFile)
        await uploadOrgPhoto(org.id, photo)
      }
      navigate(ROUTES.ORGANIZATION.LIST)
    }
  }

  const initialData = organization && isEditMode
    ? {
        name: organization.name,
        type: organization.type,
        cnpj: organization.cnpj,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        instagram: organization.instagram,
        description: organization.description,
        addressStreet: organization.addressStreet,
        addressNumber: organization.addressNumber,
        addressNeighborhood: organization.addressNeighborhood,
        addressCep: organization.addressCep,
        addressCity: organization.addressCity,
        addressState: organization.addressState,
      }
    : undefined

  return (
    <AppShell>
      <Header title={isEditMode ? 'Editar Organização' : 'Nova Organização'} showBack />
      <PageWrapper>
        {isEditMode && isLoading && !organization && (
          <p className="text-sm text-gray-500">Carregando...</p>
        )}
        {(!isEditMode || organization) && (
          <OrganizationForm
            key={organization?.id ?? 'new'}
            onSubmit={handleSubmit}
            initialData={initialData}
            isLoading={isLoading}
            submitLabel={isEditMode ? 'Salvar alterações' : undefined}
          />
        )}
      </PageWrapper>
    </AppShell>
  )
}
