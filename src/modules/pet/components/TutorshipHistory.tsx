/**
 * @module pet
 * @file TutorshipHistory.tsx
 * @description Timeline component displaying the tutorship history of a pet.
 */

import type { TutorshipHistoryEntry, TutorshipType } from '@/modules/pet/types'

interface TutorshipHistoryProps {
  entries: TutorshipHistoryEntry[]
}

const TYPE_LABELS: Record<TutorshipType, string> = {
  OWNER: 'Dono',
  TUTOR: 'Tutor',
  TEMPORARY_HOME: 'Lar Temporário',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export default function TutorshipHistory({ entries }: TutorshipHistoryProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )

  return (
    <section aria-label="Histórico de tutoria">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Histórico de Tutoria</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum histórico disponível.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {sorted.map((entry) => (
            <li key={entry.id} className="relative pl-4 border-l-2 border-gray-200">
              <p className="text-sm font-medium text-gray-900">{entry.tutorName}</p>
              <p className="text-xs text-gray-500">{TYPE_LABELS[entry.type]}</p>
              <p className="text-xs text-gray-400">
                {formatDate(entry.startDate)}
                {entry.endDate ? ` → ${formatDate(entry.endDate)}` : ' → atual'}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
