/**
 * @module pet-health
 * @file VaccineStatusPanel.tsx
 * @description Shows vaccine status per template for a pet.
 */

import type { VaccineStatusEntry, VaccineStatusValue } from '@/modules/pet-health/types'

interface VaccineStatusPanelProps {
  entries: VaccineStatusEntry[]
}

function statusBadge(status: VaccineStatusValue) {
  const map: Record<VaccineStatusValue, { label: string; classes: string }> = {
    UP_TO_DATE: { label: 'Em dia', classes: 'bg-green-100 text-green-800' },
    DUE_SOON: { label: 'Vence em breve', classes: 'bg-yellow-100 text-yellow-800' },
    OVERDUE: { label: 'Atrasada', classes: 'bg-red-100 text-red-800' },
    NOT_GIVEN: { label: 'Não aplicada', classes: 'bg-gray-100 text-gray-600' },
  }
  const { label, classes } = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}

function categoryLabel(category: string) {
  const map: Record<string, string> = {
    CORE: 'Essencial',
    NON_CORE: 'Recomendada',
    LIFESTYLE: 'Estilo de vida',
  }
  return map[category] ?? category
}

export default function VaccineStatusPanel({ entries }: VaccineStatusPanelProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhum dado de vacinação disponível para a espécie deste pet.
      </p>
    )
  }

  const sorted = [...entries].sort((a, b) => {
    const order: Record<VaccineStatusValue, number> = { OVERDUE: 0, DUE_SOON: 1, NOT_GIVEN: 2, UP_TO_DATE: 3 }
    return order[a.status] - order[b.status]
  })

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((entry) => (
        <div key={entry.templateId} className="flex flex-col gap-1 p-3 rounded-[--radius-md] border border-gray-200 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {entry.templateName}
                {entry.isRequiredByLaw && (
                  <span className="ml-1 text-xs text-red-600 font-normal">(obrigatória por lei)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">{categoryLabel(entry.category)}</p>
            </div>
            {statusBadge(entry.status)}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
            {entry.lastDoseDate && (
              <span>
                Última dose: {new Date(entry.lastDoseDate).toLocaleDateString('pt-BR')}
                {entry.totalDosesGiven > 0 && ` (dose ${entry.totalDosesGiven})`}
              </span>
            )}
            {entry.nextDueDate && (
              <span>
                Próxima: {new Date(entry.nextDueDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {entry.status === 'OVERDUE' && entry.daysOverdue !== null && entry.daysOverdue > 0 && (
              <span className="text-red-600 font-medium">{entry.daysOverdue} dia(s) em atraso</span>
            )}
            {entry.status === 'NOT_GIVEN' && (
              <span>Nenhuma dose registrada</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
