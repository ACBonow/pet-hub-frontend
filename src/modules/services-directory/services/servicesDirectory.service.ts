/**
 * @module services-directory
 * @file servicesDirectory.service.ts
 * @description API calls for the services-directory module endpoints.
 */

import api from '@/shared/services/api.client'
import type {
  ServiceListing,
  ServiceTypeRecord,
  ServiceFilters,
  PaginatedServiceListings,
  CreateServiceData,
  UpdateServiceData,
} from '@/modules/services-directory/types'

export async function listServiceTypesRequest(signal?: AbortSignal): Promise<ServiceTypeRecord[]> {
  const response = await api.get<{ success: true; data: ServiceTypeRecord[] }>(
    '/api/v1/services-directory/types',
    { signal },
  )
  return response.data.data
}

export async function listServicesRequest(
  filters?: ServiceFilters,
  signal?: AbortSignal,
): Promise<PaginatedServiceListings> {
  const response = await api.get<{
    success: true
    data: ServiceListing[]
    meta: { total: number; page: number; pageSize: number }
  }>('/api/v1/services-directory', { params: filters, signal })
  return {
    data: response.data.data,
    ...response.data.meta,
  }
}

export async function getServiceRequest(id: string, signal?: AbortSignal): Promise<ServiceListing> {
  const response = await api.get<{ success: true; data: ServiceListing }>(
    `/api/v1/services-directory/${id}`,
    { signal },
  )
  return response.data.data
}

export async function createServiceRequest(data: CreateServiceData): Promise<ServiceListing> {
  const response = await api.post<{ success: true; data: ServiceListing }>(
    '/api/v1/services-directory',
    data,
  )
  return response.data.data
}

export async function updateServiceRequest(
  id: string,
  data: UpdateServiceData,
): Promise<ServiceListing> {
  const response = await api.patch<{ success: true; data: ServiceListing }>(
    `/api/v1/services-directory/${id}`,
    data,
  )
  return response.data.data
}

export async function deleteServiceRequest(id: string): Promise<void> {
  await api.delete(`/api/v1/services-directory/${id}`)
}

export async function uploadServicePhotoRequest(
  serviceId: string,
  file: File,
): Promise<{ photoUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.patch<{ success: true; data: ServiceListing }>(
    `/api/v1/services-directory/${serviceId}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return { photoUrl: response.data.data.photoUrl ?? '' }
}
