/**
 * @module lost-found
 * @file LostFoundCard.tsx
 * @description Card component for displaying a lost or found report with visual distinction.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import CreatorBadge from '@/shared/components/ui/CreatorBadge'
import type { LostFoundReport } from '@/modules/lost-found/types'

interface LostFoundCardProps {
  report: LostFoundReport
}

export default function LostFoundCard({ report }: LostFoundCardProps) {
  const isLost = report.type === 'LOST'
  const isResolved = report.status === 'RESOLVED'

  return (
    <li
      className={[
        'bg-white rounded-[--radius-lg] border p-4',
        isResolved ? 'border-gray-200 opacity-60' : isLost ? 'border-red-200' : 'border-green-200',
      ].join(' ')}
    >
      <Link to={ROUTES.LOST_FOUND.DETAIL(report.id)} className="block">
        <div className="flex items-start gap-3">
          {report.photoUrl && (
            <img
              src={report.photoUrl}
              alt={report.petName ?? 'Animal'}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-200"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{report.petName ?? 'Animal sem nome'}</p>
            {(report.addressCity || report.addressNeighborhood || report.location) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {[report.addressNeighborhood, report.addressCity].filter(Boolean).join(', ') || report.location}
              </p>
            )}
            {report.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={[
                'text-xs font-semibold px-2 py-1 rounded-full',
                isLost
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700',
              ].join(' ')}
            >
              {isLost ? 'Perdido' : 'Achado'}
            </span>
            {isResolved && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                Resolvido
              </span>
            )}
          </div>
        </div>
        {report.createdBy && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <CreatorBadge
              type={report.createdBy.type}
              name={report.createdBy.name}
              photoUrl={report.createdBy.photoUrl}
            />
          </div>
        )}
      </Link>
    </li>
  )
}
