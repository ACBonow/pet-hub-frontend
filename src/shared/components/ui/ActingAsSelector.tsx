/**
 * @module shared
 * @file ActingAsSelector.tsx
 * @description Seletor "Criar como: Eu / Organização" para páginas de criação.
 * Só renderiza quando o usuário é OWNER ou MANAGER de ao menos uma organização.
 */

import { useActingAs } from '@/shared/hooks/useActingAs'

export default function ActingAsSelector() {
  const { context, availableOrgs, setContext } = useActingAs()

  if (availableOrgs.length === 0) return null

  const handleChange = (value: string) => {
    if (!value) {
      setContext({ type: 'person' })
    } else {
      const org = availableOrgs.find((o) => o.id === value)
      setContext({ type: 'org', organizationId: value, organizationName: org?.name })
    }
  }

  const selectedValue = context.type === 'org' ? (context.organizationId ?? '') : ''

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="acting-as" className="text-sm font-medium text-gray-700">
        Criar como
      </label>
      <select
        id="acting-as"
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
      >
        <option value="">Eu (pessoal)</option>
        {availableOrgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  )
}
