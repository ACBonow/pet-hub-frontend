import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import CreatorBadge from '@/shared/components/ui/CreatorBadge'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import type { LostFoundReport } from '@/modules/lost-found/types'

interface LostFoundCardProps {
  report: LostFoundReport
}

export default function LostFoundCard({ report }: LostFoundCardProps) {
  const isLost = report.type === 'LOST'
  const isResolved = report.status === 'RESOLVED'
  const accentColor = isResolved ? 'var(--muted)' : isLost ? 'var(--red)' : 'var(--green)'
  const location =
    [report.addressNeighborhood, report.addressCity].filter(Boolean).join(', ') ||
    report.location

  return (
    <li
      className="bg-card rounded-2xl border border-line overflow-hidden"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <Link to={ROUTES.LOST_FOUND.DETAIL(report.id)} className="flex gap-4 p-4">
        {/* Photo / placeholder */}
        {report.photoUrl ? (
          <img
            src={report.photoUrl}
            alt={report.petName ?? 'Animal'}
            className="w-24 h-24 rounded-xl object-cover shrink-0 border border-line"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-xl shrink-0 flex items-center justify-center"
            style={{
              background: `repeating-linear-gradient(135deg, ${accentColor}12, ${accentColor}12 6px, ${accentColor}08 6px, ${accentColor}08 12px)`,
              border: `1px dashed ${accentColor}44`,
            }}
          >
            <Icon name="paw" size={28} color={accentColor} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Chip color={accentColor}>
              {isLost ? 'Perdido' : 'Achado'}
            </Chip>
            {isResolved && (
              <Chip color="var(--muted)" variant="outline">Resolvido</Chip>
            )}
          </div>
          <p className="font-bold text-body">{report.petName ?? 'Animal sem nome'}</p>
          {report.species && (
            <p className="text-xs text-muted mt-0.5 capitalize">{report.species}</p>
          )}
          {report.description && (
            <p className="text-sm text-body mt-1 line-clamp-2 leading-relaxed">{report.description}</p>
          )}
          {location && (
            <p className="text-xs text-muted mt-2 flex items-center gap-1">
              <Icon name="pin" size={11} color="var(--muted)" />
              {location}
            </p>
          )}
          {report.createdBy && (
            <div className="mt-2 pt-2 border-t border-line">
              <CreatorBadge
                type={report.createdBy.type}
                name={report.createdBy.name}
                photoUrl={report.createdBy.photoUrl}
              />
            </div>
          )}
        </div>
      </Link>
    </li>
  )
}
