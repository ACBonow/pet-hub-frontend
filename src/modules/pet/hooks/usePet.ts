/**
 * @module pet
 * @file usePet.ts
 * @description Hook for loading and managing pet data.
 */

import { useState } from 'react'
import {
  listPetsRequest,
  getPetRequest,
  createPetRequest,
  updatePetRequest,
  transferTutorshipRequest,
  getTutorshipHistoryRequest,
  uploadPetPhotoRequest,
  addCoTutorRequest,
  removeCoTutorRequest,
} from '@/modules/pet/services/pet.service'
import type { Pet, CoTutor, CreatePetData, UpdatePetData, TransferTutorshipData, TutorshipHistoryEntry } from '@/modules/pet/types'
import type { ApiError } from '@/shared/types'

interface UsePetResult {
  pet: Pet | null
  pets: Pet[]
  tutorshipHistory: TutorshipHistoryEntry[]
  isLoading: boolean
  error: string | null
  getPet: (id: string) => Promise<void>
  listPets: () => Promise<void>
  createPet: (data: CreatePetData) => Promise<Pet>
  updatePet: (id: string, data: UpdatePetData) => Promise<void>
  transferTutorship: (petId: string, data: TransferTutorshipData) => Promise<void>
  getTutorshipHistory: (petId: string) => Promise<void>
  uploadPhoto: (petId: string, file: File) => Promise<Pet>
  addCoTutor: (petId: string, cpf: string) => Promise<CoTutor>
  removeCoTutor: (petId: string, coTutorId: string) => Promise<void>
}

export function usePet(): UsePetResult {
  const [pet, setPet] = useState<Pet | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [tutorshipHistory, setTutorshipHistory] = useState<TutorshipHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getPet(id: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPetRequest(id)
      setPet(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar pet.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function listPets(): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listPetsRequest()
      setPets(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar pets.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createPet(data: CreatePetData): Promise<Pet> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createPetRequest(data)
      setPet(created)
      return created
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao cadastrar pet.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function updatePet(id: string, data: UpdatePetData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await updatePetRequest(id, data)
      setPet(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao atualizar pet.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function transferTutorship(petId: string, data: TransferTutorshipData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await transferTutorshipRequest(petId, data)
      setPet(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao transferir tutoria.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getTutorshipHistory(petId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getTutorshipHistoryRequest(petId)
      setTutorshipHistory(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar histórico de tutoria.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadPhoto(petId: string, file: File): Promise<Pet> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await uploadPetPhotoRequest(petId, file)
      setPet(updated)
      return updated
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao enviar foto.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function addCoTutor(petId: string, cpf: string): Promise<CoTutor> {
    setIsLoading(true)
    setError(null)
    try {
      const coTutor = await addCoTutorRequest(petId, cpf)
      setPet((prev) => prev ? { ...prev, coTutors: [...prev.coTutors, coTutor] } : prev)
      return coTutor
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao adicionar co-tutor.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function removeCoTutor(petId: string, coTutorId: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await removeCoTutorRequest(petId, coTutorId)
      setPet((prev) => prev ? { ...prev, coTutors: prev.coTutors.filter((c) => c.id !== coTutorId) } : prev)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao remover co-tutor.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { pet, pets, tutorshipHistory, isLoading, error, getPet, listPets, createPet, updatePet, transferTutorship, getTutorshipHistory, uploadPhoto, addCoTutor, removeCoTutor }
}
