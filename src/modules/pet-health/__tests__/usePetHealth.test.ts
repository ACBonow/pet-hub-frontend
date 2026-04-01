/**
 * @module pet-health
 * @file __tests__/usePetHealth.test.ts
 * @description Tests for the usePetHealth hook — deleteExamFile.
 */

import { renderHook, act } from '@testing-library/react'
import { usePetHealth } from '@/modules/pet-health/hooks/usePetHealth'
import * as petHealthService from '@/modules/pet-health/services/petHealth.service'

jest.mock('@/modules/pet-health/services/petHealth.service')

const mockService = petHealthService as jest.Mocked<typeof petHealthService>

const EXAM_FIXTURE = {
  id: 'exam-1',
  name: 'Hemograma',
  fileUrl: 'https://storage.example.com/exams/hemograma.pdf',
  examDate: '2026-01-10',
  fileType: 'PDF' as const,
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
