/**
 * @module pet-health
 * @file VaccineCatalogSelector.tsx
 * @description Dropdown selector for picking a vaccine from the catalog.
 */

import type { VaccineTemplate } from '@/modules/pet-health/types'

interface VaccineCatalogSelectorProps {
  templates: VaccineTemplate[]
  value: string
  onChange: (templateId: string) => void
  isLoading?: boolean
}

export default function VaccineCatalogSelector({
  templates,
  value,
  onChange,
  isLoading,
}: VaccineCatalogSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="vaccine-template" className="text-sm font-medium text-gray-700">
        Vacina do catálogo (opcional)
      </label>
      <select
        id="vaccine-template"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
      >
        <option value="">— Selecionar do catálogo —</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
            {t.isRequiredByLaw ? ' *' : ''}
          </option>
        ))}
      </select>
      {templates.length === 0 && !isLoading && (
        <p className="text-xs text-gray-400">Catálogo indisponível. Preencha manualmente.</p>
      )}
    </div>
  )
}
