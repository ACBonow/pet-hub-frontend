/**
 * @module shared
 * @file components/ui/CreatorBadge.tsx
 * @description Displays the creator of a listing — person or organization — with avatar and name.
 */

interface CreatorBadgeProps {
  type: 'person' | 'org'
  name: string
  photoUrl?: string | null
}

export default function CreatorBadge({ type, name, photoUrl }: CreatorBadgeProps) {
  const initial = name.charAt(0).toUpperCase()
  const iconLabel = type === 'person' ? 'Pessoa' : 'Organização'

  return (
    <div className="flex items-center gap-1.5">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-6 h-6 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-[10px] font-semibold text-gray-600">{initial}</span>
        </div>
      )}
      <span className="text-xs" aria-label={iconLabel}>
        {type === 'person' ? '👤' : '🏢'}
      </span>
      <span className="text-xs text-gray-600 truncate">{name}</span>
    </div>
  )
}
