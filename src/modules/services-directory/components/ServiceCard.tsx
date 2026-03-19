/**
 * @module services-directory
 * @file ServiceCard.tsx
 * @description Card component displaying a service listing with type badge.
 */

import { SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from '@/modules/services-directory/types'
import type { ServiceListing } from '@/modules/services-directory/types'

interface ServiceCardProps {
  service: ServiceListing
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const badgeClass = SERVICE_TYPE_COLORS[service.type]
  const typeLabel = SERVICE_TYPE_LABELS[service.type]

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">{service.name}</h3>
        <span
          className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
        >
          {typeLabel}
        </span>
      </div>

      {service.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
      )}

      <dl className="space-y-1">
        {service.address && (
          <div className="flex items-start gap-1 text-sm text-gray-500">
            <dt className="sr-only">Endereço</dt>
            <dd>{service.address}</dd>
          </div>
        )}
        {service.phone && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <dt className="sr-only">Telefone</dt>
            <dd>
              <a href={`tel:${service.phone}`} className="hover:text-gray-900">
                {service.phone}
              </a>
            </dd>
          </div>
        )}
        {service.email && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <dt className="sr-only">E-mail</dt>
            <dd>
              <a href={`mailto:${service.email}`} className="hover:text-gray-900 truncate">
                {service.email}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </article>
  )
}
