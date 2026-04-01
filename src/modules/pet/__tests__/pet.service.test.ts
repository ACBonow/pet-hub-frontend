/**
 * @module pet
 * @file __tests__/pet.service.test.ts
 * @description Tests for pet.service — getOrgPetsRequest.
 */

import api from '@/shared/services/api.client'
import { getOrgPetsRequest } from '@/modules/pet/services/pet.service'
import type { Pet } from '@/modules/pet/types'

jest.mock('@/shared/services/api.client')

const mockApi = api as jest.Mocked<typeof api>

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
  coTutorIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('pet.service — getOrgPetsRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should GET /api/v1/organizations/:orgId/pets', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [] } })
    await getOrgPetsRequest('org-1')
    expect(mockApi.get).toHaveBeenCalledWith('/api/v1/organizations/org-1/pets')
  })

  it('should return the pets array from response', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [PET_FIXTURE] } })
    const result = await getOrgPetsRequest('org-1')
    expect(result).toEqual([PET_FIXTURE])
  })

  it('should return empty array when org has no pets', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [] } })
    const result = await getOrgPetsRequest('org-1')
    expect(result).toEqual([])
  })

  it('should propagate error on failure', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network error'))
    await expect(getOrgPetsRequest('org-1')).rejects.toThrow('Network error')
  })
})
