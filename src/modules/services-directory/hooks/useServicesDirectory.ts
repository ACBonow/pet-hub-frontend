/**
 * @module services-directory
 * @file useServicesDirectory.ts
 * @description Hook for managing services directory state and API interactions.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
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
import type { ApiError } from '@/shared/types'

interface UseServicesDirectoryState {
  services: ServiceListing[]
  service: ServiceListing | null
  serviceTypes: ServiceTypeRecord[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
}

export function useServicesDirectory() {
  const [state, setState] = useState<UseServicesDirectoryState>({
    services: [],
    service: null,
    serviceTypes: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  })

  const listAbortRef = useRef<AbortController | null>(null)
  const typesAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      listAbortRef.current?.abort()
      typesAbortRef.current?.abort()
    }
  }, [])

  const listServiceTypes = useCallback(async () => {
    typesAbortRef.current?.abort()
    const controller = new AbortController()
    typesAbortRef.current = controller

    try {
      const types = await listServiceTypesRequest(controller.signal)
      setState((prev) => ({ ...prev, serviceTypes: types }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      // silently fail — types still show as empty
    }
  }, [])

  const listServices = useCallback(async (filters?: ServiceFilters) => {
    listAbortRef.current?.abort()
    const controller = new AbortController()
    listAbortRef.current = controller

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await listServicesRequest(filters, controller.signal)
      setState((prev) => ({
        ...prev,
        services: result.data,
        currentPage: result.meta.page,
        totalPages: result.meta.totalPages,
        isLoading: false,
      }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar serviços.',
      }))
    }
  }, [])

  const getService = useCallback(async (id: string) => {
    listAbortRef.current?.abort()
    const controller = new AbortController()
    listAbortRef.current = controller

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await getServiceRequest(id, controller.signal)
      setState((prev) => ({ ...prev, service: result, isLoading: false }))
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
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
