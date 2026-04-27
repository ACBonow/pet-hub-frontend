/**
 * @module pet-health
 * @file petHealth.service.ts
 * @description API calls for the pet-health module endpoints.
 */

import api from '@/shared/services/api.client'
import type {
  CreatePreventiveData,
  CreateVaccinationData,
  ExamFile,
  PreventiveRecord,
  UploadExamData,
  Vaccination,
  VaccineStatusEntry,
  VaccineTemplate,
} from '@/modules/pet-health/types'

export type { VaccineTemplate, VaccineStatusEntry, PreventiveRecord }

// ─── Vaccine Catalog ──────────────────────────────────────────────────────────

export async function listVaccineCatalogRequest(
  params?: { type?: string; species?: string; category?: string },
  signal?: AbortSignal,
): Promise<VaccineTemplate[]> {
  const query = new URLSearchParams()
  if (params?.type) query.set('type', params.type)
  if (params?.species) query.set('species', params.species)
  if (params?.category) query.set('category', params.category)
  const url = `/api/v1/vaccine-catalog${query.toString() ? `?${query}` : ''}`
  const response = await api.get<{ success: true; data: VaccineTemplate[] }>(url, { signal })
  return response.data.data
}

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

// ─── Vaccine Status ───────────────────────────────────────────────────────────

export async function getVaccineStatusRequest(petId: string, signal?: AbortSignal): Promise<VaccineStatusEntry[]> {
  const response = await api.get<{ success: true; data: VaccineStatusEntry[] }>(
    `/api/v1/pet-health/${petId}/vaccine-status`,
    { signal },
  )
  return response.data.data
}

// ─── Preventive Records ───────────────────────────────────────────────────────

export async function listPreventivesRequest(petId: string, signal?: AbortSignal): Promise<PreventiveRecord[]> {
  const response = await api.get<{ success: true; data: PreventiveRecord[] }>(
    `/api/v1/pet-health/${petId}/preventives`,
    { signal },
  )
  return response.data.data
}

export async function createPreventiveRequest(petId: string, data: CreatePreventiveData): Promise<PreventiveRecord> {
  const response = await api.post<{ success: true; data: PreventiveRecord }>(
    `/api/v1/pet-health/${petId}/preventives`,
    data,
  )
  return response.data.data
}

export async function deletePreventiveRequest(petId: string, preventiveId: string): Promise<void> {
  await api.delete(`/api/v1/pet-health/${petId}/preventives/${preventiveId}`)
}
