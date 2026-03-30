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
} from '@/modules/organization/services/organization.service'
import type { Organization, CreateOrganizationData, UpdateOrganizationData, OrgMember } from '@/modules/organization/types'
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
  createOrganization: (data: CreateOrganizationData) => Promise<void>
  updateOrganization: (id: string, data: UpdateOrganizationData) => Promise<void>
  getMembers: (id: string) => Promise<void>
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

  async function createOrganization(data: CreateOrganizationData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createOrganizationRequest(data)
      setOrganization(created)
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

  return { organization, organizations, members, isLoading, error, getOrganization, listOrganizations, listMyOrganizations, createOrganization, updateOrganization, getMembers }
}
