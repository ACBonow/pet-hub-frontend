/**
 * @module organization
 * @file ResponsiblePersonsManager.tsx
 * @description Component for managing the list of responsible persons for an organization.
 */

interface ResponsiblePerson {
  id: string
  name: string
  email: string
}

interface ResponsiblePersonsManagerProps {
  persons: ResponsiblePerson[]
  onAdd?: (personId: string) => void
  onRemove?: (personId: string) => void
  readOnly?: boolean
}

export default function ResponsiblePersonsManager({
  persons,
  onRemove,
  readOnly = false,
}: ResponsiblePersonsManagerProps) {
  return (
    <section aria-label="Pessoas responsáveis">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Pessoas Responsáveis</h2>
      {persons.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma pessoa responsável vinculada.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {persons.map((person) => (
            <li
              key={person.id}
              className="flex items-center justify-between bg-gray-50 rounded-[--radius-md] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">{person.email}</p>
              </div>
              {!readOnly && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(person.id)}
                  aria-label={`Remover ${person.name}`}
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
