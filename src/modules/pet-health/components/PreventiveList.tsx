/**
 * @module pet-health
 * @file PreventiveList.tsx
 * @description List of preventive treatment records (flea/tick/dewormer) for a pet.
 */

import type { PreventiveRecord } from '@/modules/pet-health/types'

interface PreventiveListProps {
  records: PreventiveRecord[]
  onDelete?: (id: string) => void
}

export default function PreventiveList({ records, onDelete }: PreventiveListProps) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-gray-500">Nenhum preventivo registrado.</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => (
        <div key={record.id} className="flex flex-col gap-1 p-3 rounded-[--radius-md] border border-gray-200 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{record.productName}</p>
              {record.brand && <p className="text-xs text-gray-500">{record.brand}</p>}
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(record.id)}
                className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
                aria-label={`Remover ${record.productName}`}
              >
                Remover
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
            <span>Aplicado: {new Date(record.appliedAt).toLocaleDateString('pt-BR')}</span>
            {record.nextDueDate && (
              <span>Próximo: {new Date(record.nextDueDate).toLocaleDateString('pt-BR')}</span>
            )}
          </div>
          {record.notes && <p className="text-xs text-gray-400 mt-1">{record.notes}</p>}
        </div>
      ))}
    </div>
  )
}
