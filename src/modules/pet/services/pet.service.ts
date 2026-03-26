/**
 * @module pet
 * @file pet.service.ts
 * @description API calls for the pet module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Pet, CreatePetData, UpdatePetData, TransferTutorshipData, TutorshipHistoryEntry } from '@/modules/pet/types'

export async function listPetsRequest(): Promise<Pet[]> {
  const response = await api.get<{ success: true; data: Pet[] }>('/api/v1/pets')
  return response.data.data
}

export async function getPetRequest(id: string): Promise<Pet> {
  const response = await api.get<{ success: true; data: Pet }>(`/api/v1/pets/${id}`)
  return response.data.data
}

export async function createPetRequest(data: CreatePetData): Promise<Pet> {
  const response = await api.post<{ success: true; data: Pet }>('/api/v1/pets', data)
  return response.data.data
}

export async function updatePetRequest(id: string, data: UpdatePetData): Promise<Pet> {
  const response = await api.put<{ success: true; data: Pet }>(`/api/v1/pets/${id}`, data)
  return response.data.data
}

export async function transferTutorshipRequest(petId: string, data: TransferTutorshipData): Promise<Pet> {
  const response = await api.post<{ success: true; data: Pet }>(`/api/v1/pets/${petId}/transfer-tutorship`, {
    tutorType: 'PERSON',
    personCpf: data.newTutorCpf,
    tutorshipType: data.tutorshipType,
  })
  return response.data.data
}

export async function getTutorshipHistoryRequest(petId: string): Promise<TutorshipHistoryEntry[]> {
  const response = await api.get<{ success: true; data: TutorshipHistoryEntry[] }>(`/api/v1/pets/${petId}/tutorship-history`)
  return response.data.data
}

export async function uploadPetPhotoRequest(petId: string, file: File): Promise<Pet> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post<{ success: true; data: Pet }>(
    `/api/v1/pets/${petId}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return response.data.data
}
