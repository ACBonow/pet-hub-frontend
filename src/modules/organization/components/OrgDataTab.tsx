/**
 * @module organization
 * @file components/OrgDataTab.tsx
 * @description Tab component for displaying organization data with optional edit link.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import { applyCnpjMask } from '@/shared/utils/mask'
import type { Organization, OrgRole } from '@/modules/organization/types'

const TYPE_LABELS: Record<string, string> = {
  COMPANY: 'Empresa',
  NGO: 'ONG',
}

interface OrgDataTabProps {
  organization: Organization
  myRole: OrgRole | undefined
}

export default function OrgDataTab({ organization, myRole }: OrgDataTabProps) {
  const isOwner = myRole === 'OWNER'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
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
      </div>

      <div>
        <p className="text-xl font-bold text-gray-900">{organization.name}</p>
        <p className="text-sm text-gray-500">{TYPE_LABELS[organization.type]}</p>
        {organization.cnpj && (
          <p className="text-sm text-gray-500 mt-1">CNPJ: {applyCnpjMask(organization.cnpj)}</p>
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

      {isOwner && (
        <Link
          to={ROUTES.ORGANIZATION.EDIT(organization.id)}
          className="text-sm font-medium text-[--color-primary] hover:underline"
        >
          Editar organização
        </Link>
      )}
    </div>
  )
}
