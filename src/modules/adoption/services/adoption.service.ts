/**
 * @module adoption
 * @file adoption.service.ts
 * @description API calls for the adoption module endpoints.
 */

import api from '@/shared/services/api.client'
import type { AdoptionListing, AdoptionFilters, CreateAdoptionData, UpdateAdoptionData } from '@/modules/adoption/types'

export async function listAdoptionsRequest(filters?: AdoptionFilters): Promise<AdoptionListing[]> {
  const response = await api.get<{ success: true; data: AdoptionListing[] }>('/api/v1/adoptions', { params: filters })
  return response.data.data
}

export async function getAdoptionRequest(id: string): Promise<AdoptionListing> {
  const response = await api.get<{ success: true; data: AdoptionListing }>(`/api/v1/adoptions/${id}`)
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
