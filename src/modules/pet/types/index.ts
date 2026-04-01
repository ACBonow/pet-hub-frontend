/**
 * @module pet
 * @file types/index.ts
 * @description TypeScript types for the pet module.
 */

export type TutorshipType = 'OWNER' | 'TUTOR' | 'TEMPORARY_HOME'

export interface CoTutor {
  id: string
  name: string
}

export interface Pet {
  id: string
  name: string
  species: string
  breed: string | null
  gender: string | null
  castrated: boolean | null
  birthDate: string | null
  photoUrl: string | null
  primaryTutorId: string
  primaryTutorshipType: TutorshipType
  coTutors: CoTutor[]
  createdAt: string
  updatedAt: string
}

export interface CreatePetData {
  name: string
  species: string
  breed?: string | null
  gender?: string | null
  castrated?: boolean | null
  birthDate?: string | null
  tutorshipType?: TutorshipType
  organizationId?: string | null
}

export interface UpdatePetData {
  name?: string
  species?: string
  breed?: string | null
  gender?: string | null
  castrated?: boolean | null
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
