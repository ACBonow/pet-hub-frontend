/**
 * @module adoption
 * @file AdoptionCard.tsx
 * @description Card component for displaying adoption listing summary.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import type { AdoptionListing } from '@/modules/adoption/types'

interface AdoptionCardProps {
  listing: AdoptionListing
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

export default function AdoptionCard({ listing }: AdoptionCardProps) {
  return (
    <li className="bg-white rounded-[--radius-lg] border border-gray-200 overflow-hidden">
      <Link to={ROUTES.ADOPTION.DETAIL(listing.id)} className="block">
        {listing.photoUrl ? (
          <img
            src={listing.photoUrl}
            alt={listing.petName}
            loading="lazy"
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">🐾</span>
          </div>
        )}
        <div className="p-3">
          <p className="font-semibold text-gray-900">{listing.petName}</p>
          <p className="text-sm text-gray-500">
            {SPECIES_LABELS[listing.species] ?? listing.species}
            {listing.breed ? ` · ${listing.breed}` : ''}
          </p>
          {listing.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
          )}
        </div>
      </Link>
    </li>
  )
}
