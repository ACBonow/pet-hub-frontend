/**
 * @module pet
 * @file PetCard.tsx
 * @description Card component for displaying pet summary.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import type { Pet } from '@/modules/pet/types'

interface PetCardProps {
  pet: Pet
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Coelho',
  other: 'Outro',
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <li className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
      <Link to={ROUTES.PET.DETAIL(pet.id)} className="block">
        <div className="flex items-start gap-3">
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-xl">🐾</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{pet.name}</p>
            <p className="text-sm text-gray-500">
              {SPECIES_LABELS[pet.species] ?? pet.species}
              {pet.breed ? ` · ${pet.breed}` : ''}
              {pet.gender === 'M' ? ' · Macho' : pet.gender === 'F' ? ' · Fêmea' : ''}
              {pet.castrated === true ? ' · Castrado(a)' : ''}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}
