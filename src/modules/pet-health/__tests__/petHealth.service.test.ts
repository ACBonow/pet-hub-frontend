/**
 * @module pet-health
 * @file __tests__/petHealth.service.test.ts
 * @description Tests for petHealth.service API calls.
 */

import api from '@/shared/services/api.client'
import {
  listVaccinationsRequest,
  createVaccinationRequest,
  listExamFilesRequest,
  uploadExamFileRequest,
  deleteExamFileRequest,
  deleteVaccinationRequest,
} from '@/modules/pet-health/services/petHealth.service'

jest.mock('@/shared/services/api.client')

const mockApi = api as jest.Mocked<typeof api>

describe('petHealth.service — listVaccinationsRequest', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('should GET /api/v1/pet-health/:petId/vaccination-card', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [] } })
    await listVaccinationsRequest('pet-1')
    expect(mockApi.get).toHaveBeenCalledWith('/api/v1/pet-health/pet-1/vaccination-card')
  })
})

describe('petHealth.service — createVaccinationRequest', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('should POST /api/v1/pet-health/:petId/vaccinations', async () => {
    const vac = { vaccineName: 'Antirrábica', applicationDate: '2026-01-10' }
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: {} } })
    await createVaccinationRequest('pet-1', vac)
    expect(mockApi.post).toHaveBeenCalledWith('/api/v1/pet-health/pet-1/vaccinations', vac)
  })
})

describe('petHealth.service — listExamFilesRequest', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('should GET /api/v1/pet-health/:petId/exams', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [] } })
    await listExamFilesRequest('pet-1')
    expect(mockApi.get).toHaveBeenCalledWith('/api/v1/pet-health/pet-1/exams')
  })
})

describe('petHealth.service — uploadExamFileRequest', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('should POST /api/v1/pet-health/:petId/exams with examType field in FormData', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: {} } })
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' })
    await uploadExamFileRequest('pet-1', { examType: 'Hemograma', examDate: '2026-01-10', file })
    const [url, formData] = mockApi.post.mock.calls[0]
    expect(url).toBe('/api/v1/pet-health/pet-1/exams')
    expect(formData instanceof FormData).toBe(true)
    expect((formData as FormData).get('examType')).toBe('Hemograma')
  })
})

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
