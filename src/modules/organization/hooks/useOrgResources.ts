/**
 * @module organization
 * @file hooks/useOrgResources.ts
 * @description Hook for loading organization-scoped resources in the dashboard.
 */

import { useState, useRef, useEffect } from 'react'
import { getOrgPetsRequest } from '@/modules/pet/services/pet.service'
import { listAdoptionsRequest } from '@/modules/adoption/services/adoption.service'
import { listReportsRequest } from '@/modules/lost-found/services/lostFound.service'
import { listServicesRequest } from '@/modules/services-directory/services/servicesDirectory.service'
import type { Pet } from '@/modules/pet/types'
import type { AdoptionListing } from '@/modules/adoption/types'
import type { LostFoundReport } from '@/modules/lost-found/types'
import type { ServiceListing } from '@/modules/services-directory/types'
import type { ApiError } from '@/shared/types'

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

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function loadPets(orgId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const pets = await getOrgPetsRequest(orgId, controller.signal)
      setState(s => ({ ...s, pets, isLoading: false }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar pets.' }))
    }
  }

  async function loadAdoptions(orgId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const result = await listAdoptionsRequest({ organizationId: orgId }, controller.signal)
      setState(s => ({ ...s, adoptions: result.data, isLoading: false }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar adoções.' }))
    }
  }

  async function loadReports(orgId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const result = await listReportsRequest({ organizationId: orgId }, controller.signal)
      setState(s => ({ ...s, reports: result.data, isLoading: false }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      setState(s => ({ ...s, isLoading: false, error: 'Erro ao carregar achados/perdidos.' }))
    }
  }

  async function loadServices(orgId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const result = await listServicesRequest({ organizationId: orgId }, controller.signal)
      setState(s => ({ ...s, services: result.data, isLoading: false }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
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
