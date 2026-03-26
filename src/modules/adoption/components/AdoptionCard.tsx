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

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponível',
  RESERVED: 'Reservado',
  ADOPTED: 'Adotado',
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  ADOPTED: 'bg-gray-100 text-gray-500',
}

const GENDER_LABELS: Record<string, string> = {
  M: 'Macho',
  F: 'Fêmea',
}

export default function AdoptionCard({ listing }: AdoptionCardProps) {
  return (
    <li className="bg-white rounded-[--radius-lg] border border-gray-200 overflow-hidden">
      <Link to={ROUTES.ADOPTION.DETAIL(listing.id)} className="block">
        <div className="relative">
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
          <span
            className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[listing.status] ?? 'bg-gray-100 text-gray-500'}`}
          >
            {STATUS_LABELS[listing.status] ?? listing.status}
          </span>
        </div>
        <div className="p-3 flex flex-col gap-1">
          <p className="font-semibold text-gray-900">{listing.petName}</p>
          <p className="text-sm text-gray-500">
            {SPECIES_LABELS[listing.species] ?? listing.species}
            {listing.breed ? ` · ${listing.breed}` : ''}
            {listing.gender ? ` · ${GENDER_LABELS[listing.gender] ?? listing.gender}` : ''}
            {listing.castrated != null ? ` · ${listing.castrated ? 'Castrado(a)' : 'Não castrado(a)'}` : ''}
          </p>
          {listing.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{listing.description}</p>
          )}
        </div>
      </Link>
    </li>
  )
}
