/**
 * @module organization
 * @file organization.service.ts
 * @description API calls for the organization module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Organization, CreateOrganizationData, UpdateOrganizationData, OrgMember, OrgRole } from '@/modules/organization/types'

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

export async function getOrgMembersRequest(id: string): Promise<OrgMember[]> {
  const response = await api.get<{ success: true; data: OrgMember[] }>(`/api/v1/organizations/${id}/members`)
  return response.data.data
}

export async function addOrgMemberRequest(orgId: string, cpf: string, role: OrgRole): Promise<void> {
  await api.post(`/api/v1/organizations/${orgId}/members`, { cpf, role })
}

export async function removeOrgMemberRequest(orgId: string, personId: string): Promise<void> {
  await api.delete(`/api/v1/organizations/${orgId}/members/${personId}`)
}

export async function changeMemberRoleRequest(orgId: string, personId: string, role: OrgRole): Promise<void> {
  await api.patch(`/api/v1/organizations/${orgId}/members/${personId}/role`, { role })
}

export async function uploadOrgPhotoRequest(orgId: string, file: File): Promise<{ photoUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.patch<{ success: true; data: Organization }>(
    `/api/v1/organizations/${orgId}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return { photoUrl: response.data.data.photoUrl ?? '' }
}
