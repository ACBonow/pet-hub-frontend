/**
 * @module organization
 * @file hooks/useOrgResources.ts
 * @description Hook for loading organization-scoped resources in the dashboard.
 */

import { useState } from 'react'
import { listPetsRequest } from '@/modules/pet/services/pet.service'
import { listAdoptionsRequest } from '@/modules/adoption/services/adoption.service'
import { listReportsRequest } from '@/modules/lost-found/services/lostFound.service'
import { listServicesRequest } from '@/modules/services-directory/services/servicesDirectory.service'
import type { Pet } from '@/modules/pet/types'
import type { AdoptionListing } from '@/modules/adoption/types'
import type { LostFoundReport } from '@/modules/lost-found/types'
import type { ServiceListing } from '@/modules/services-directory/types'

interface OrgResourcesState {
  pets: Pet[]
  adoptions: AdoptionListing[]
  reports: LostFoundReport[]
  services: ServiceListing[]
  isLoading: boolean
  error: string | null
}

export function useOrgResources() {
  const [state, setState] = useState<OrgResourcesState>({
    pets: [],
    adoptions: [],
    reports: [],
    services: [],
    isLoading: false,
    error: null,
  })

  async function loadPets(orgId: string): Promise<void> {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const pets = await listPetsRequest({ organizationId: orgId })
      setState(s => ({ ...s, pets, isLoading: false }))
    } catch {
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar pets.' }))
    }
  }

  async function loadAdoptions(orgId: string): Promise<void> {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const adoptions = await listAdoptionsRequest({ organizationId: orgId })
      setState(s => ({ ...s, adoptions, isLoading: false }))
    } catch {
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar adoções.' }))
    }
  }

  async function loadReports(orgId: string): Promise<void> {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const reports = await listReportsRequest({ organizationId: orgId })
      setState(s => ({ ...s, reports, isLoading: false }))
    } catch {
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar achados/perdidos.' }))
    }
  }

  async function loadServices(orgId: string): Promise<void> {
    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const result = await listServicesRequest({ organizationId: orgId })
      setState(s => ({ ...s, services: result.data, isLoading: false }))
    } catch {
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar serviços.' }))
    }
  }

  return {
    ...state,
    loadPets,
    loadAdoptions,
    loadReports,
    loadServices,
  }
}
