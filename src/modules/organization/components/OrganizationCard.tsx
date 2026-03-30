/**
 * @module organization
 * @file OrganizationCard.tsx
 * @description Card component for displaying organization summary.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import { applyCnpjMask } from '@/shared/utils/mask'
import type { Organization } from '@/modules/organization/types'

interface OrganizationCardProps {
  organization: Organization
}

const TYPE_LABELS: Record<string, string> = {
  COMPANY: 'Empresa',
  NGO: 'ONG',
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <li className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
      <Link to={ROUTES.ORGANIZATION.DETAIL(organization.id)} className="block">
        <div className="flex items-start gap-3">
          {organization.photoUrl ? (
            <img
              src={organization.photoUrl}
              alt={organization.name}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-gray-500">
                {organization.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{organization.name}</p>
                <p className="text-sm text-gray-500">{TYPE_LABELS[organization.type]}</p>
                {organization.cnpj && (
                  <p className="text-sm text-gray-500">
                    CNPJ: {applyCnpjMask(organization.cnpj)}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 shrink-0">
                {TYPE_LABELS[organization.type]}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
