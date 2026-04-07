/**
 * @module adoption
 * @file adoption.service.ts
 * @description API calls for the adoption module endpoints.
 */

import api from '@/shared/services/api.client'
import type { AdoptionListing, AdoptionFilters, AdoptionStatus, CreateAdoptionData, UpdateAdoptionData, PaginatedAdoptionListings } from '@/modules/adoption/types'

export async function listAdoptionsRequest(filters?: AdoptionFilters, signal?: AbortSignal): Promise<PaginatedAdoptionListings> {
  const response = await api.get<{
    success: true
    data: AdoptionListing[]
    meta: { page: number; pageSize: number; total: number; totalPages: number }
  }>('/api/v1/adoptions', { params: filters, signal })
  return { data: response.data.data, meta: response.data.meta }
}

export async function getAdoptionRequest(id: string, signal?: AbortSignal): Promise<AdoptionListing> {
  const response = await api.get<{ success: true; data: AdoptionListing }>(`/api/v1/adoptions/${id}`, { signal })
  return response.data.data
}

export async function createAdoptionRequest(data: CreateAdoptionData): Promise<AdoptionListing> {
  const response = await api.post<{ success: true; data: AdoptionListing }>('/api/v1/adoptions', data)
  return response.data.data
}

export async function updateAdoptionRequest(id: string, data: UpdateAdoptionData): Promise<AdoptionListing> {
  const response = await api.put<{ success: true; data: AdoptionListing }>(`/api/v1/adoptions/${id}`, data)
  return response.data.data
}

export async function updateAdoptionStatusRequest(id: string, status: AdoptionStatus): Promise<AdoptionListing> {
  const response = await api.patch<{ success: true; data: AdoptionListing }>(`/api/v1/adoptions/${id}/status`, { status })
  return response.data.data
}
