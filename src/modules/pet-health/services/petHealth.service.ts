/**
 * @module pet-health
 * @file petHealth.service.ts
 * @description API calls for the pet-health module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Vaccination, CreateVaccinationData, ExamFile, UploadExamData } from '@/modules/pet-health/types'

export async function listVaccinationsRequest(petId: string, signal?: AbortSignal): Promise<Vaccination[]> {
  const response = await api.get<{ success: true; data: Vaccination[] }>(`/api/v1/pet-health/${petId}/vaccination-card`, { signal })
  return response.data.data
}

export async function createVaccinationRequest(petId: string, data: CreateVaccinationData): Promise<Vaccination> {
  const response = await api.post<{ success: true; data: Vaccination }>(`/api/v1/pet-health/${petId}/vaccinations`, data)
  return response.data.data
}

export async function listExamFilesRequest(petId: string, signal?: AbortSignal): Promise<ExamFile[]> {
  const response = await api.get<{ success: true; data: ExamFile[] }>(`/api/v1/pet-health/${petId}/exams`, { signal })
  return response.data.data
}

export async function uploadExamFileRequest(petId: string, data: UploadExamData): Promise<ExamFile> {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('examType', data.examType)
  formData.append('examDate', data.examDate)
  if (data.labName) formData.append('labName', data.labName)
  if (data.notes) formData.append('notes', data.notes)

  const response = await api.post<{ success: true; data: ExamFile }>(
    `/api/v1/pet-health/${petId}/exams`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data.data
}

export async function deleteExamFileRequest(petId: string, examId: string): Promise<void> {
  await api.delete(`/api/v1/pet-health/${petId}/exams/${examId}`)
}

export async function deleteVaccinationRequest(petId: string, vaccinationId: string): Promise<void> {
  await api.delete(`/api/v1/pet-health/${petId}/vaccinations/${vaccinationId}`)
}
