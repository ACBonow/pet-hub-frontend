import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import CreatorBadge from '@/shared/components/ui/CreatorBadge'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import type { ServiceListing } from '@/modules/services-directory/types'

interface ServiceCardProps {
  service: ServiceListing
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const typeLabel = service.serviceType.label

  return (
    <Link
      to={ROUTES.SERVICES.DETAIL(service.id)}
      className="group block bg-card rounded-2xl border border-line overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
    >
      {/* Photo / placeholder */}
      {service.photoUrl ? (
        <img
          src={service.photoUrl}
          alt={service.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div
          className="w-full h-40 flex items-center justify-center"
          style={{
            background: 'repeating-linear-gradient(135deg, var(--soft), var(--soft) 8px, var(--line) 8px, var(--line) 16px)',
          }}
        >
          <Icon name="stethoscope" size={40} color="var(--muted)" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-body text-base leading-tight">{service.name}</h3>
          <Chip color="var(--info)" className="shrink-0">{typeLabel}</Chip>
        </div>

        {service.description && (
          <p className="text-sm text-muted line-clamp-2 leading-relaxed">{service.description}</p>
        )}

        {service.city && (
          <p className="text-xs text-muted mt-2 flex items-center gap-1">
            <Icon name="pin" size={11} color="var(--muted)" />
            {[service.neighborhood, service.city].filter(Boolean).join(', ')}
          </p>
        )}

        {service.createdBy && (
          <div className="mt-3 pt-3 border-t border-line">
            <CreatorBadge
              type={service.createdBy.type}
              name={service.createdBy.name}
              photoUrl={service.createdBy.photoUrl}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
