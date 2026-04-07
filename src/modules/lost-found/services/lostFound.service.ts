/**
 * @module lost-found
 * @file lostFound.service.ts
 * @description API calls for the lost-found module endpoints.
 */

import api from '@/shared/services/api.client'
import type { LostFoundReport, LostFoundFilters, LostFoundStatus, CreateLostFoundData } from '@/modules/lost-found/types'

export async function listReportsRequest(filters?: LostFoundFilters, signal?: AbortSignal): Promise<LostFoundReport[]> {
  const response = await api.get<{ success: true; data: LostFoundReport[] }>('/api/v1/lost-found', { params: filters, signal })
  return response.data.data
}

export async function getReportRequest(id: string, signal?: AbortSignal): Promise<LostFoundReport> {
  const response = await api.get<{ success: true; data: LostFoundReport }>(`/api/v1/lost-found/${id}`, { signal })
  return response.data.data
}

export async function createReportRequest(data: CreateLostFoundData): Promise<LostFoundReport> {
  const response = await api.post<{ success: true; data: LostFoundReport }>('/api/v1/lost-found', data)
  return response.data.data
}

export async function updateLostFoundStatusRequest(id: string, status: LostFoundStatus): Promise<LostFoundReport> {
  const response = await api.patch<{ success: true; data: LostFoundReport }>(`/api/v1/lost-found/${id}/status`, { status })
  return response.data.data
}

export async function uploadLostFoundPhotoRequest(reportId: string, file: File): Promise<LostFoundReport> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post<{ success: true; data: LostFoundReport }>(
    `/api/v1/lost-found/${reportId}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data.data
}
