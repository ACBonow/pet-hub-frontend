/**
 * @module pet-health
 * @file petHealth.service.ts
 * @description API calls for the pet-health module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Vaccination, CreateVaccinationData, ExamFile, UploadExamData } from '@/modules/pet-health/types'

export async function listVaccinationsRequest(petId: string): Promise<Vaccination[]> {
  const response = await api.get<{ success: true; data: Vaccination[] }>(`/api/v1/pets/${petId}/vaccinations`)
  return response.data.data
}

export async function createVaccinationRequest(petId: string, data: CreateVaccinationData): Promise<Vaccination> {
  const response = await api.post<{ success: true; data: Vaccination }>(`/api/v1/pets/${petId}/vaccinations`, data)
  return response.data.data
}

export async function listExamFilesRequest(petId: string): Promise<ExamFile[]> {
  const response = await api.get<{ success: true; data: ExamFile[] }>(`/api/v1/pets/${petId}/exams`)
  return response.data.data
}

export async function uploadExamFileRequest(petId: string, data: UploadExamData): Promise<ExamFile> {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('name', data.name)
  formData.append('examDate', data.examDate)

  const response = await api.post<{ success: true; data: ExamFile }>(
    `/api/v1/pets/${petId}/exams`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data.data
}
