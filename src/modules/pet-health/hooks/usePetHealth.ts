/**
 * @module pet-health
 * @file usePetHealth.ts
 * @description Hook for loading and managing pet health data.
 */

import { useState } from 'react'
import {
  listVaccinationsRequest,
  createVaccinationRequest,
  listExamFilesRequest,
  uploadExamFileRequest,
  deleteExamFileRequest,
  deleteVaccinationRequest,
} from '@/modules/pet-health/services/petHealth.service'
import type { Vaccination, CreateVaccinationData, ExamFile, UploadExamData } from '@/modules/pet-health/types'
import type { ApiError } from '@/shared/types'

interface UsePetHealthResult {
  vaccinations: Vaccination[]
  examFiles: ExamFile[]
  isLoading: boolean
  error: string | null
  listVaccinations: (petId: string) => Promise<void>
  createVaccination: (petId: string, data: CreateVaccinationData) => Promise<void>
  deleteVaccination: (petId: string, vaccinationId: string) => Promise<void>
  listExamFiles: (petId: string) => Promise<void>
  uploadExamFile: (petId: string, data: UploadExamData) => Promise<void>
  deleteExamFile: (petId: string, examId: string) => Promise<void>
}

export function usePetHealth(): UsePetHealthResult {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [examFiles, setExamFiles] = useState<ExamFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function listVaccinations(petId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listVaccinationsRequest(petId)
      setVaccinations(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar vacinas.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createVaccination(petId: string, data: CreateVaccinationData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createVaccinationRequest(petId, data)
      setVaccinations((prev) => [created, ...prev])
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao registrar vacina.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function listExamFiles(petId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listExamFilesRequest(petId)
      setExamFiles(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar exames.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadExamFile(petId: string, data: UploadExamData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const uploaded = await uploadExamFileRequest(petId, data)
      setExamFiles((prev) => [uploaded, ...prev])
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao enviar exame.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteVaccination(petId: string, vaccinationId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await deleteVaccinationRequest(petId, vaccinationId)
      setVaccinations((prev) => prev.filter((v) => v.id !== vaccinationId))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao remover vacina.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteExamFile(petId: string, examId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await deleteExamFileRequest(petId, examId)
      setExamFiles((prev) => prev.filter((e) => e.id !== examId))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao remover exame.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { vaccinations, examFiles, isLoading, error, listVaccinations, createVaccination, deleteVaccination, listExamFiles, uploadExamFile, deleteExamFile }
}
