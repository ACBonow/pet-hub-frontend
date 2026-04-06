/**
 * @module person
 * @file person.service.ts
 * @description API calls for the person module endpoints.
 */

import api from '@/shared/services/api.client'
import type { Person, CreatePersonData, UpdatePersonData } from '@/modules/person/types'

export async function getMeRequest(signal?: AbortSignal): Promise<Person> {
  const response = await api.get<{ success: true; data: Person }>('/api/v1/persons/me', { signal })
  return response.data.data
}

export async function createPersonRequest(data: CreatePersonData): Promise<Person> {
  const response = await api.post<{ success: true; data: Person }>('/api/v1/persons', data)
  return response.data.data
}

export async function getPersonRequest(id: string, signal?: AbortSignal): Promise<Person> {
  const response = await api.get<{ success: true; data: Person }>(`/api/v1/persons/${id}`, { signal })
  return response.data.data
}

export async function updatePersonRequest(id: string, data: UpdatePersonData): Promise<Person> {
  const response = await api.put<{ success: true; data: Person }>(`/api/v1/persons/${id}`, data)
  return response.data.data
}
