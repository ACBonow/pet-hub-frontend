import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import Icon from '@/shared/components/ui/Icon'
import type { Pet } from '@/modules/pet/types'

interface PetCardProps {
  pet: Pet
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão', cat: 'Gato', bird: 'Ave', rabbit: 'Coelho', other: 'Outro',
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <li>
      <Link
        to={ROUTES.PET.DETAIL(pet.id)}
        className="flex items-center gap-3 bg-card border border-line rounded-2xl p-4 hover:bg-soft hover:-translate-y-0.5 transition-all duration-150 group"
      >
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-line"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-soft flex items-center justify-center shrink-0 border border-line">
            <Icon name="paw" size={22} color="var(--muted)" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-body truncate">{pet.name}</p>
          <p className="text-xs text-muted mt-0.5 truncate">
            {SPECIES_LABELS[pet.species] ?? pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
            {pet.gender === 'M' ? ' · Macho' : pet.gender === 'F' ? ' · Fêmea' : ''}
            {pet.castrated === true ? ' · Castrado(a)' : ''}
          </p>
        </div>
        <Icon name="arrow" size={14} color="var(--muted)" className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </li>
  )
}
