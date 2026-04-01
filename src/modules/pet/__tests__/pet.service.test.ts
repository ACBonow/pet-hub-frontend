/**
 * @module pet
 * @file __tests__/pet.service.test.ts
 * @description Tests for pet.service API calls.
 */

import api from '@/shared/services/api.client'
import { getOrgPetsRequest, addCoTutorRequest, removeCoTutorRequest } from '@/modules/pet/services/pet.service'
import type { Pet, CoTutor } from '@/modules/pet/types'

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
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const CO_TUTOR_FIXTURE: CoTutor = {
  id: 'co-1',
  name: 'Maria Santos',
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

describe('pet.service — addCoTutorRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should POST /api/v1/pets/:id/co-tutors with tutorType PERSON and personCpf', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: CO_TUTOR_FIXTURE } })
    await addCoTutorRequest('pet-1', '52998224725')
    expect(mockApi.post).toHaveBeenCalledWith('/api/v1/pets/pet-1/co-tutors', {
      tutorType: 'PERSON',
      personCpf: '52998224725',
    })
  })

  it('should return the co-tutor from response', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: CO_TUTOR_FIXTURE } })
    const result = await addCoTutorRequest('pet-1', '52998224725')
    expect(result).toEqual(CO_TUTOR_FIXTURE)
  })

  it('should propagate error on failure', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('TUTOR_CONFLICT'))
    await expect(addCoTutorRequest('pet-1', '52998224725')).rejects.toThrow('TUTOR_CONFLICT')
  })
})

describe('pet.service — removeCoTutorRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should DELETE /api/v1/pets/:id/co-tutors/:coTutorId', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} })
    await removeCoTutorRequest('pet-1', 'co-1')
    expect(mockApi.delete).toHaveBeenCalledWith('/api/v1/pets/pet-1/co-tutors/co-1')
  })

  it('should propagate error on failure', async () => {
    mockApi.delete.mockRejectedValueOnce(new Error('NOT_FOUND'))
    await expect(removeCoTutorRequest('pet-1', 'co-1')).rejects.toThrow('NOT_FOUND')
  })
})
