/**
 * @module organization
 * @file useOrganization.ts
 * @description Hook for loading and managing organization data.
 */

import { useState } from 'react'
import {
  listOrganizationsRequest,
  listMyOrganizationsRequest,
  getOrganizationRequest,
  createOrganizationRequest,
  updateOrganizationRequest,
  getOrgMembersRequest,
  addOrgMemberRequest,
  removeOrgMemberRequest,
  changeMemberRoleRequest,
  uploadOrgPhotoRequest,
} from '@/modules/organization/services/organization.service'
import type { Organization, CreateOrganizationData, UpdateOrganizationData, OrgMember, OrgRole } from '@/modules/organization/types'
import type { ApiError } from '@/shared/types'

interface UseOrganizationResult {
  organization: Organization | null
  organizations: Organization[]
  members: OrgMember[]
  isLoading: boolean
  error: string | null
  getOrganization: (id: string) => Promise<void>
  listOrganizations: () => Promise<void>
  listMyOrganizations: () => Promise<void>
  createOrganization: (data: CreateOrganizationData) => Promise<Organization>
  updateOrganization: (id: string, data: UpdateOrganizationData) => Promise<void>
  getMembers: (id: string) => Promise<void>
  addMember: (orgId: string, cpf: string, role: OrgRole) => Promise<void>
  removeMember: (orgId: string, personId: string) => Promise<void>
  changeRole: (orgId: string, personId: string, role: OrgRole) => Promise<void>
  uploadOrgPhoto: (orgId: string, file: File) => Promise<void>
}

export function useOrganization(): UseOrganizationResult {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [members, setMembers] = useState<OrgMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getOrganization(id: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getOrganizationRequest(id)
      setOrganization(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar organização.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function listOrganizations(): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listOrganizationsRequest()
      setOrganizations(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar organizações.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function listMyOrganizations(): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listMyOrganizationsRequest()
      setOrganizations(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar suas organizações.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createOrganization(data: CreateOrganizationData): Promise<Organization> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createOrganizationRequest(data)
      setOrganization(created)
      return created
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao criar organização.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function updateOrganization(id: string, data: UpdateOrganizationData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await updateOrganizationRequest(id, data)
      setOrganization(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao atualizar organização.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getMembers(id: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getOrgMembersRequest(id)
      setMembers(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar membros.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function addMember(orgId: string, cpf: string, role: OrgRole): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await addOrgMemberRequest(orgId, cpf, role)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao adicionar membro.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function removeMember(orgId: string, personId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await removeOrgMemberRequest(orgId, personId)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao remover membro.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function changeRole(orgId: string, personId: string, role: OrgRole): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await changeMemberRoleRequest(orgId, personId, role)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao alterar papel do membro.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadOrgPhoto(orgId: string, file: File): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const { photoUrl } = await uploadOrgPhotoRequest(orgId, file)
      if (organization) {
        setOrganization({ ...organization, photoUrl })
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao enviar foto.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { organization, organizations, members, isLoading, error, getOrganization, listOrganizations, listMyOrganizations, createOrganization, updateOrganization, getMembers, addMember, removeMember, changeRole, uploadOrgPhoto }
}
