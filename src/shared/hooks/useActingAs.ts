/**
 * @module shared
 * @file useActingAs.ts
 * @description Hook para contexto "Agindo Como" — pessoa física ou organização.
 * O contexto persiste via Zustand ao navegar entre páginas.
 * Só inclui organizações onde o usuário é OWNER ou MANAGER.
 */

import { useEffect } from 'react'
import { create } from 'zustand'
import { listMyOrganizationsRequest } from '@/modules/organization/services/organization.service'

export interface ActingAsContext {
  type: 'person' | 'org'
  organizationId?: string
  organizationName?: string
}

interface AvailableOrg {
  id: string
  name: string
}

interface ActingAsStore {
  context: ActingAsContext
  availableOrgs: AvailableOrg[]
  setContext: (ctx: ActingAsContext) => void
  setAvailableOrgs: (orgs: AvailableOrg[]) => void
}

export const useActingAsStore = create<ActingAsStore>((set) => ({
  context: { type: 'person' },
  availableOrgs: [],
  setContext: (ctx) => set({ context: ctx }),
  setAvailableOrgs: (orgs) => set({ availableOrgs: orgs }),
}))

export function useActingAs() {
  const { context, availableOrgs, setContext, setAvailableOrgs } = useActingAsStore()

  useEffect(() => {
    listMyOrganizationsRequest()
      .then((orgs) => {
        const eligible = orgs
          .filter((o) => o.myRole === 'OWNER' || o.myRole === 'MANAGER')
          .map((o) => ({ id: o.id, name: o.name }))
        setAvailableOrgs(eligible)
      })
      .catch(() => {
        // silently ignore — user may not be authenticated yet
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { context, availableOrgs, setContext }
}
