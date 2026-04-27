/**
 * @module pet-health
 * @file __tests__/usePetHealth.test.ts
 * @description Tests for the usePetHealth hook — deleteExamFile and deleteVaccination.
 */

import { renderHook, act } from '@testing-library/react'
import { usePetHealth } from '@/modules/pet-health/hooks/usePetHealth'
import * as petHealthService from '@/modules/pet-health/services/petHealth.service'

jest.mock('@/modules/pet-health/services/petHealth.service')

const mockService = petHealthService as jest.Mocked<typeof petHealthService>

const VACCINATION_FIXTURE = {
  id: 'vac-1',
  petId: 'pet-1',
  templateId: null,
  doseNumber: null,
  vaccineName: 'Antirrábica',
  manufacturer: null,
  batchNumber: null,
  applicationDate: '2025-03-19',
  nextDueDate: null,
  veterinarianName: null,
  clinicName: null,
  fileUrl: null,
  notes: null,
  createdAt: '2025-03-19T00:00:00.000Z',
}

const EXAM_FIXTURE = {
  id: 'exam-1',
  petId: 'pet-1',
  examType: 'Hemograma',
  fileUrl: 'https://storage.example.com/exams/hemograma.pdf',
  examDate: '2026-01-10',
  labName: null,
  notes: null,
  createdAt: '2026-01-10T00:00:00.000Z',
}

describe('usePetHealth — deleteExamFile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call deleteExamFileRequest with petId and examId', async () => {
    mockService.deleteExamFileRequest.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.deleteExamFile('pet-1', 'exam-1')
    })

    expect(mockService.deleteExamFileRequest).toHaveBeenCalledWith('pet-1', 'exam-1')
  })

  it('should remove the exam from examFiles state', async () => {
    mockService.listExamFilesRequest.mockResolvedValueOnce([EXAM_FIXTURE])
    mockService.deleteExamFileRequest.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.listExamFiles('pet-1')
      await result.current.deleteExamFile('pet-1', 'exam-1')
    })

    expect(result.current.examFiles).toEqual([])
  })

  it('should set error when deleteExamFile fails', async () => {
    mockService.deleteExamFileRequest.mockRejectedValueOnce({
      message: 'Sem permissão.',
    })

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.deleteExamFile('pet-1', 'exam-1').catch(() => {})
    })

    expect(result.current.error).toBe('Sem permissão.')
  })
})

describe('usePetHealth — deleteVaccination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call deleteVaccinationRequest with petId and vaccinationId', async () => {
    mockService.deleteVaccinationRequest.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.deleteVaccination('pet-1', 'vac-1')
    })

    expect(mockService.deleteVaccinationRequest).toHaveBeenCalledWith('pet-1', 'vac-1')
  })

  it('should remove the vaccination from vaccinations state', async () => {
    mockService.listVaccinationsRequest.mockResolvedValueOnce([VACCINATION_FIXTURE])
    mockService.deleteVaccinationRequest.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.listVaccinations('pet-1')
      await result.current.deleteVaccination('pet-1', 'vac-1')
    })

    expect(result.current.vaccinations).toEqual([])
  })

  it('should set error when deleteVaccination fails', async () => {
    mockService.deleteVaccinationRequest.mockRejectedValueOnce({
      message: 'Vacina não encontrada.',
    })

    const { result } = renderHook(() => usePetHealth())

    await act(async () => {
      await result.current.deleteVaccination('pet-1', 'vac-1').catch(() => {})
    })

    expect(result.current.error).toBe('Vacina não encontrada.')
  })
})
