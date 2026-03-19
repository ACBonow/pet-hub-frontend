/**
 * @module services-directory
 * @file servicesDirectory.service.ts
 * @description API calls for the services-directory module endpoints.
 */

import api from '@/shared/services/api.client'
import type {
  ServiceListing,
  ServiceFilters,
  PaginatedServiceListings,
  CreateServiceData,
  UpdateServiceData,
} from '@/modules/services-directory/types'

export async function listServicesRequest(
  filters?: ServiceFilters,
): Promise<PaginatedServiceListings> {
  const response = await api.get<{ success: true; data: PaginatedServiceListings }>(
    '/api/v1/services-directory',
    { params: filters },
  )
  return response.data.data
}

export async function getServiceRequest(id: string): Promise<ServiceListing> {
  const response = await api.get<{ success: true; data: ServiceListing }>(
    `/api/v1/services-directory/${id}`,
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
