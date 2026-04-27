/**
 * @module pet-health
 * @file usePetHealth.ts
 * @description Hook for loading and managing pet health data.
 */

import { useState, useRef, useEffect } from 'react'
import {
  listVaccinationsRequest,
  createVaccinationRequest,
  listExamFilesRequest,
  uploadExamFileRequest,
  deleteExamFileRequest,
  deleteVaccinationRequest,
  getVaccineStatusRequest,
  listPreventivesRequest,
  createPreventiveRequest,
  deletePreventiveRequest,
} from '@/modules/pet-health/services/petHealth.service'
import type {
  CreatePreventiveData,
  CreateVaccinationData,
  ExamFile,
  PreventiveRecord,
  UploadExamData,
  Vaccination,
  VaccineStatusEntry,
} from '@/modules/pet-health/types'
import type { ApiError } from '@/shared/types'

interface UsePetHealthResult {
  vaccinations: Vaccination[]
  examFiles: ExamFile[]
  vaccineStatus: VaccineStatusEntry[]
  preventives: PreventiveRecord[]
  isLoading: boolean
  error: string | null
  listVaccinations: (petId: string) => Promise<void>
  createVaccination: (petId: string, data: CreateVaccinationData) => Promise<void>
  deleteVaccination: (petId: string, vaccinationId: string) => Promise<void>
  listExamFiles: (petId: string) => Promise<void>
  uploadExamFile: (petId: string, data: UploadExamData) => Promise<void>
  deleteExamFile: (petId: string, examId: string) => Promise<void>
  loadVaccineStatus: (petId: string) => Promise<void>
  listPreventives: (petId: string) => Promise<void>
  addPreventive: (petId: string, data: CreatePreventiveData) => Promise<void>
  deletePreventive: (petId: string, preventiveId: string) => Promise<void>
}

export function usePetHealth(): UsePetHealthResult {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [examFiles, setExamFiles] = useState<ExamFile[]>([])
  const [vaccineStatus, setVaccineStatus] = useState<VaccineStatusEntry[]>([])
  const [preventives, setPreventives] = useState<PreventiveRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function listVaccinations(petId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await listVaccinationsRequest(petId, controller.signal)
      setVaccinations(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
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
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await listExamFilesRequest(petId, controller.signal)
      setExamFiles(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
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

  async function loadVaccineStatus(petId: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await getVaccineStatusRequest(petId, controller.signal)
      setVaccineStatus(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar status vacinal.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function listPreventives(petId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listPreventivesRequest(petId)
      setPreventives(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar preventivos.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function addPreventive(petId: string, data: CreatePreventiveData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createPreventiveRequest(petId, data)
      setPreventives((prev) => [created, ...prev])
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao registrar preventivo.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function deletePreventive(petId: string, preventiveId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await deletePreventiveRequest(petId, preventiveId)
      setPreventives((prev) => prev.filter((p) => p.id !== preventiveId))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao remover preventivo.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    vaccinations,
    examFiles,
    vaccineStatus,
    preventives,
    isLoading,
    error,
    listVaccinations,
    createVaccination,
    deleteVaccination,
    listExamFiles,
    uploadExamFile,
    deleteExamFile,
    loadVaccineStatus,
    listPreventives,
    addPreventive,
    deletePreventive,
  }
}
