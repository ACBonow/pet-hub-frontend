/**
 * @module person
 * @file usePerson.ts
 * @description Hook for loading and updating person data.
 */

import { useState } from 'react'
import { getPersonRequest, updatePersonRequest } from '@/modules/person/services/person.service'
import type { Person, UpdatePersonData } from '@/modules/person/types'
import type { ApiError } from '@/shared/types'

interface UsePersonResult {
  person: Person | null
  isLoading: boolean
  error: string | null
  getPerson: (id: string) => Promise<void>
  updatePerson: (id: string, data: UpdatePersonData) => Promise<void>
}

export function usePerson(): UsePersonResult {
  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return { person, isLoading, error, getPerson, updatePerson }
}
