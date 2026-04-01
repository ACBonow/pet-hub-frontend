/**
 * @module pet-health
 * @file __tests__/petHealth.service.test.ts
 * @description Tests for petHealth.service API calls.
 */

import api from '@/shared/services/api.client'
import { deleteExamFileRequest, deleteVaccinationRequest } from '@/modules/pet-health/services/petHealth.service'

jest.mock('@/shared/services/api.client')

const mockApi = api as jest.Mocked<typeof api>

describe('petHealth.service — deleteExamFileRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should DELETE /api/v1/pet-health/:petId/exams/:examId', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} })
    await deleteExamFileRequest('pet-1', 'exam-1')
    expect(mockApi.delete).toHaveBeenCalledWith('/api/v1/pet-health/pet-1/exams/exam-1')
  })

  it('should propagate error on failure', async () => {
    mockApi.delete.mockRejectedValueOnce(new Error('NOT_FOUND'))
    await expect(deleteExamFileRequest('pet-1', 'exam-1')).rejects.toThrow('NOT_FOUND')
  })
})

describe('petHealth.service — deleteVaccinationRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should DELETE /api/v1/pet-health/:petId/vaccinations/:vaccinationId', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} })
    await deleteVaccinationRequest('pet-1', 'vac-1')
    expect(mockApi.delete).toHaveBeenCalledWith('/api/v1/pet-health/pet-1/vaccinations/vac-1')
  })

  it('should propagate error on failure', async () => {
    mockApi.delete.mockRejectedValueOnce(new Error('NOT_FOUND'))
    await expect(deleteVaccinationRequest('pet-1', 'vac-1')).rejects.toThrow('NOT_FOUND')
  })
})
