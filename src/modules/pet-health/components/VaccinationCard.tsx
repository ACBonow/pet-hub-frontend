/**
 * @module pet-health
 * @file VaccinationCard.tsx
 * @description Component listing vaccinations in reverse chronological order with next dose alert.
 */

import type { Vaccination } from '@/modules/pet-health/types'

interface VaccinationCardProps {
  vaccinations: Vaccination[]
  today?: Date
  onDelete?: (vaccinationId: string) => Promise<void>
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function isWithin30Days(dateStr: string, today: Date): boolean {
  const nextDose = new Date(dateStr)
  const diffMs = nextDose.getTime() - today.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 30
}

export default function VaccinationCard({ vaccinations, today = new Date(), onDelete }: VaccinationCardProps) {
  const sorted = [...vaccinations].sort(
    (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime(),
  )

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma vacina registrada.</p>
  }

  return (
    <ul className="flex flex-col gap-3" role="list">
      {sorted.map((vac) => {
        const alert = vac.nextDueDate && isWithin30Days(vac.nextDueDate, today)

        return (
          <li
            key={vac.id}
            className={[
              'bg-white rounded-[--radius-md] border p-3',
              alert ? 'border-amber-300 bg-amber-50' : 'border-gray-200',
            ].join(' ')}
          >
            <p className="font-medium text-gray-900">{vac.vaccineName}</p>
            <p className="text-xs text-gray-500">
              Aplicação: {formatDate(vac.applicationDate)}
            </p>
            {vac.nextDueDate && (
              <p className="text-xs text-gray-500">
                Próxima dose: {formatDate(vac.nextDueDate)}
              </p>
            )}
            {alert && (
              <p className="text-xs font-semibold text-amber-700 mt-1">
                ⚠ Próxima dose em breve
              </p>
            )}
            {vac.notes && (
              <p className="text-xs text-gray-400 mt-1">{vac.notes}</p>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label={`Remover ${vac.vaccineName}`}
                onClick={() => onDelete(vac.id)}
                className="mt-2 text-xs text-[--color-danger] hover:underline"
              >
                Remover
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
