/**
 * @module organization
 * @file __tests__/useOrgResources.test.ts
 * @description Tests for useOrgResources hook — loadPets uses getOrgPetsRequest.
 */

import { renderHook, act } from '@testing-library/react'
import { useOrgResources } from '@/modules/organization/hooks/useOrgResources'
import { getOrgPetsRequest } from '@/modules/pet/services/pet.service'
import type { Pet } from '@/modules/pet/types'

jest.mock('@/modules/pet/services/pet.service')
jest.mock('@/modules/adoption/services/adoption.service', () => ({
  listAdoptionsRequest: jest.fn(),
}))
jest.mock('@/modules/lost-found/services/lostFound.service', () => ({
  listReportsRequest: jest.fn(),
}))
jest.mock('@/modules/services-directory/services/servicesDirectory.service', () => ({
  listServicesRequest: jest.fn(),
}))

const mockGetOrgPets = getOrgPetsRequest as jest.MockedFunction<typeof getOrgPetsRequest>

const PET_FIXTURE: Pet = {
  id: 'p1',
  name: 'Rex',
  species: 'dog',
  breed: null,
  gender: 'M',
  castrated: false,
  birthDate: null,
  photoUrl: null,
  primaryTutorId: 'u1',
  primaryTutorshipType: 'OWNER',
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('useOrgResources — loadPets', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call getOrgPetsRequest with the orgId', async () => {
    mockGetOrgPets.mockResolvedValueOnce([])
    const { result } = renderHook(() => useOrgResources())
    await act(async () => { await result.current.loadPets('org-1') })
    expect(mockGetOrgPets).toHaveBeenCalledWith('org-1', expect.any(AbortSignal))
  })

  it('should set pets state on success', async () => {
    mockGetOrgPets.mockResolvedValueOnce([PET_FIXTURE])
    const { result } = renderHook(() => useOrgResources())
    await act(async () => { await result.current.loadPets('org-1') })
    expect(result.current.pets).toEqual([PET_FIXTURE])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set error state on failure', async () => {
    mockGetOrgPets.mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useOrgResources())
    await act(async () => { await result.current.loadPets('org-1') })
    expect(result.current.error).toBe('Erro ao carregar pets.')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.pets).toEqual([])
  })

  it('should set isLoading true while fetching', async () => {
    let resolve!: (v: Pet[]) => void
    mockGetOrgPets.mockReturnValueOnce(new Promise(r => { resolve = r }))
    const { result } = renderHook(() => useOrgResources())
    act(() => { void result.current.loadPets('org-1') })
    expect(result.current.isLoading).toBe(true)
    await act(async () => { resolve([]) })
  })
})
