/**
 * @module services-directory
 * @file useServicesDirectory.ts
 * @description Hook for managing services directory state and API interactions.
 */

import { useState, useCallback } from 'react'
import {
  listServicesRequest,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} from '@/modules/services-directory/services/servicesDirectory.service'
import type {
  ServiceListing,
  ServiceFilters,
  CreateServiceData,
  UpdateServiceData,
} from '@/modules/services-directory/types'

interface UseServicesDirectoryState {
  services: ServiceListing[]
  service: ServiceListing | null
  isLoading: boolean
  error: string | null
}

export function useServicesDirectory() {
  const [state, setState] = useState<UseServicesDirectoryState>({
    services: [],
    service: null,
    isLoading: false,
    error: null,
  })

  const listServices = useCallback(async (filters?: ServiceFilters) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await listServicesRequest(filters)
      setState((prev) => ({ ...prev, services: result.data, isLoading: false }))
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar serviços.',
      }))
    }
  }, [])

  const getService = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await getServiceRequest(id)
      setState((prev) => ({ ...prev, service: result, isLoading: false }))
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar serviço.',
      }))
    }
  }, [])

  const createService = useCallback(async (data: CreateServiceData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await createServiceRequest(data)
      setState((prev) => ({
        ...prev,
        services: [...prev.services, result],
        isLoading: false,
      }))
      return result
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao cadastrar serviço.',
      }))
    }
  }, [])

  const updateService = useCallback(async (id: string, data: UpdateServiceData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await updateServiceRequest(id, data)
      setState((prev) => ({
        ...prev,
        services: prev.services.map((s) => (s.id === id ? result : s)),
        service: prev.service?.id === id ? result : prev.service,
        isLoading: false,
      }))
      return result
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao atualizar serviço.',
      }))
    }
  }, [])

  const deleteService = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await deleteServiceRequest(id)
      setState((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.id !== id),
        isLoading: false,
      }))
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao excluir serviço.',
      }))
    }
  }, [])

  return {
    ...state,
    listServices,
    getService,
    createService,
    updateService,
    deleteService,
  }
}
