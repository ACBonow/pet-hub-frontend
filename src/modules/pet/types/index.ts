/**
 * @module pet
 * @file types/index.ts
 * @description TypeScript types for the pet module.
 */

export type TutorshipType = 'OWNER' | 'TUTOR' | 'TEMPORARY_HOME'

export interface Pet {
  id: string
  name: string
  species: string
  breed: string | null
  birthDate: string | null
  photoUrl: string | null
  primaryTutorId: string
  primaryTutorshipType: TutorshipType
  coTutorIds: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePetData {
  name: string
  species: string
  breed?: string | null
  birthDate?: string | null
  tutorshipType?: TutorshipType
}

export interface UpdatePetData {
  name?: string
  species?: string
  breed?: string | null
  birthDate?: string | null
}

export interface TransferTutorshipData {
  newTutorCpf: string
  tutorshipType: TutorshipType
}

export interface TutorshipHistoryEntry {
  id: string
  petId: string
  tutorId: string
  tutorName: string
  type: TutorshipType
  startDate: string
  endDate: string | null
}
