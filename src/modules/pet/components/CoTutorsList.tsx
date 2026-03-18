/**
 * @module pet
 * @file CoTutorsList.tsx
 * @description Component for managing the list of co-tutors for a pet.
 */

interface CoTutor {
  id: string
  name: string
}

interface CoTutorsListProps {
  coTutors: CoTutor[]
  onRemove?: (tutorId: string) => void
  readOnly?: boolean
}

export default function CoTutorsList({ coTutors, onRemove, readOnly = false }: CoTutorsListProps) {
  return (
    <section aria-label="Co-tutores">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Co-tutores</h2>
      {coTutors.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum co-tutor vinculado.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {coTutors.map((tutor) => (
            <li
              key={tutor.id}
              className="flex items-center justify-between bg-gray-50 rounded-[--radius-md] px-3 py-2"
            >
              <p className="text-sm font-medium text-gray-900">{tutor.name}</p>
              {!readOnly && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(tutor.id)}
                  aria-label={`Remover co-tutor ${tutor.name}`}
                  className="text-xs text-[--color-danger] hover:underline ml-2"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
