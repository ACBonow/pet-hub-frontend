/**
 * @module organization
 * @file OrganizationDetailPage.tsx
 * @description Page for viewing organization details, member list, and role-based actions.
 */

import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import { applyCnpjMask } from '@/shared/utils/mask'
import type { OrgRole } from '@/modules/organization/types'

const TYPE_LABELS: Record<string, string> = {
  COMPANY: 'Empresa',
  NGO: 'ONG',
}

const ROLE_LABELS: Record<OrgRole, string> = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
}

const ROLE_COLORS: Record<OrgRole, string> = {
  OWNER: 'bg-yellow-100 text-yellow-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  MEMBER: 'bg-gray-100 text-gray-700',
}

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { organization, isLoading, error, getOrganization, getMembers, uploadOrgPhoto } = useOrganization()
  const photoInputRef = useRef<HTMLInputElement>(null)

  const canEditPhoto = organization?.myRole === 'OWNER' || organization?.myRole === 'MANAGER'

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && id) {
      await uploadOrgPhoto(id, file)
    }
  }

  useEffect(() => {
    if (id) {
      getOrganization(id)
      getMembers(id)
    }
  }, [id])

  return (
    <AppShell>
      <Header title="Organização" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {organization && (
          <div className="flex flex-col gap-4">
            {/* Org info card */}
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <div className="flex items-start gap-3 mb-3">
                {organization.photoUrl ? (
                  <img
                    src={organization.photoUrl}
                    alt={organization.name}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-gray-500">
                      {organization.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {canEditPhoto && (
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-sm font-medium text-[--color-primary] hover:underline"
                    >
                      Alterar foto
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{organization.name}</p>
              <p className="text-sm text-gray-500">{TYPE_LABELS[organization.type]}</p>
              {organization.cnpj && (
                <p className="text-sm text-gray-500 mt-1">
                  CNPJ: {applyCnpjMask(organization.cnpj)}
                </p>
              )}
              {organization.email && (
                <p className="text-sm text-gray-500">{organization.email}</p>
              )}
              {organization.phone && (
                <p className="text-sm text-gray-500">{organization.phone}</p>
              )}
              {organization.description && (
                <p className="text-sm text-gray-700 mt-2">{organization.description}</p>
              )}
            </div>

            {/* Members section */}
            {organization.responsiblePersons && organization.responsiblePersons.length > 0 && (
              <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Membros</p>
                <ul className="flex flex-col gap-2">
                  {organization.responsiblePersons.map((member) => (
                    <li key={member.personId} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-mono truncate max-w-[180px]">
                        {member.personId}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[member.role]}`}
                      >
                        {ROLE_LABELS[member.role]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* OWNER-only actions */}
            {organization.myRole === 'OWNER' && (
              <Link
                to={ROUTES.ORGANIZATION.EDIT(organization.id)}
                className="text-sm font-medium text-[--color-primary] hover:underline"
              >
                Editar organização
              </Link>
            )}
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
