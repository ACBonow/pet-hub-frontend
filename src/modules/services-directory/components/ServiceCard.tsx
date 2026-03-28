/**
 * @module services-directory
 * @file ServiceCard.tsx
 * @description Card component displaying a service listing with type badge.
 * Contact info is gated behind authentication — shown only on detail page.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import type { ServiceListing } from '@/modules/services-directory/types'

interface ServiceCardProps {
  service: ServiceListing
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const badgeClass = service.serviceType.color
  const typeLabel = service.serviceType.label

  return (
    <Link to={ROUTES.SERVICES.DETAIL(service.id)} className="block">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{service.name}</h3>
          <span
            className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {typeLabel}
          </span>
        </div>

        {service.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
        )}
      </article>
    </Link>
  )
}
