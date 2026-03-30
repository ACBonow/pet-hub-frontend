/**
 * @module services-directory
 * @file useServicesDirectory.ts
 * @description Hook for managing services directory state and API interactions.
 */

import { useState, useCallback } from 'react'
import {
  listServiceTypesRequest,
  listServicesRequest,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  uploadServicePhotoRequest,
} from '@/modules/services-directory/services/servicesDirectory.service'
import type {
  ServiceListing,
  ServiceTypeRecord,
  ServiceFilters,
  CreateServiceData,
  UpdateServiceData,
} from '@/modules/services-directory/types'

interface UseServicesDirectoryState {
  services: ServiceListing[]
  service: ServiceListing | null
  serviceTypes: ServiceTypeRecord[]
  isLoading: boolean
  error: string | null
}

export function useServicesDirectory() {
  const [state, setState] = useState<UseServicesDirectoryState>({
    services: [],
    service: null,
    serviceTypes: [],
    isLoading: false,
    error: null,
  })

  const listServiceTypes = useCallback(async () => {
    try {
      const types = await listServiceTypesRequest()
      setState((prev) => ({ ...prev, serviceTypes: types }))
    } catch {
      // silently fail — types still show as empty
    }
  }, [])

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

  const uploadServicePhoto = useCallback(async (serviceId: string, file: File): Promise<void> => {
    try {
      await uploadServicePhotoRequest(serviceId, file)
    } catch {
      // silently fail — photo upload failure does not block navigation
    }
  }, [])

  return {
    ...state,
    listServiceTypes,
    listServices,
    getService,
    createService,
    updateService,
    deleteService,
    uploadServicePhoto,
  }
}
