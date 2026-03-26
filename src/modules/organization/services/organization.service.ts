/**
 * @module organization
 * @file organization.service.ts
 * @description API calls for the organization module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/modules/organization/types'

export async function listOrganizationsRequest(): Promise<Organization[]> {
  const response = await api.get<{ success: true; data: Organization[] }>('/api/v1/organizations')
  return response.data.data
}

export async function listMyOrganizationsRequest(): Promise<Organization[]> {
  const response = await api.get<{ success: true; data: Organization[] }>('/api/v1/organizations/my')
  return response.data.data
}

export async function getOrganizationRequest(id: string): Promise<Organization> {
  const response = await api.get<{ success: true; data: Organization }>(`/api/v1/organizations/${id}`)
  return response.data.data
}

export async function createOrganizationRequest(data: CreateOrganizationData): Promise<Organization> {
  const response = await api.post<{ success: true; data: Organization }>('/api/v1/organizations', data)
  return response.data.data
}

export async function updateOrganizationRequest(id: string, data: UpdateOrganizationData): Promise<Organization> {
  const response = await api.put<{ success: true; data: Organization }>(`/api/v1/organizations/${id}`, data)
  return response.data.data
}
