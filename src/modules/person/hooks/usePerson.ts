/**
 * @module person
 * @file usePerson.ts
 * @description Hook for loading and updating person data.
 */

import { useState } from 'react'
import {
  getMeRequest,
  createPersonRequest,
  getPersonRequest,
  updatePersonRequest,
} from '@/modules/person/services/person.service'
import type { Person, CreatePersonData, UpdatePersonData } from '@/modules/person/types'
import type { ApiError } from '@/shared/types'

interface UsePersonResult {
  person: Person | null
  isLoading: boolean
  error: string | null
  getMe: () => Promise<void>
  createPerson: (data: CreatePersonData) => Promise<void>
  getPerson: (id: string) => Promise<void>
  updatePerson: (id: string, data: UpdatePersonData) => Promise<void>
}

export function usePerson(): UsePersonResult {
  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getMe(): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMeRequest()
      setPerson(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar perfil.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createPerson(data: CreatePersonData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createPersonRequest(data)
      setPerson(created)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao criar perfil.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getPerson(id: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPersonRequest(id)
      setPerson(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar dados da pessoa.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function updatePerson(id: string, data: UpdatePersonData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await updatePersonRequest(id, data)
      setPerson(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao atualizar dados.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { person, isLoading, error, getMe, createPerson, getPerson, updatePerson }
}
