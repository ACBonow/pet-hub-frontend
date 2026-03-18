/**
 * @module adoption
 * @file types/index.ts
 * @description TypeScript types for the adoption module.
 */

export type AdoptionStatus = 'AVAILABLE' | 'RESERVED' | 'ADOPTED'

export interface AdoptionListing {
  id: string
  petId: string
  petName: string
  species: string
  breed: string | null
  photoUrl: string | null
  description: string | null
  status: AdoptionStatus
  contactEmail: string | null
  contactPhone: string | null
  organizationId: string | null
  createdAt: string
  updatedAt: string
}

export interface AdoptionFilters {
  species?: string
  status?: AdoptionStatus
  organizationId?: string
}

export interface CreateAdoptionData {
  petId: string
  description?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  organizationId?: string | null
}

export interface UpdateAdoptionData {
  description?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  status?: AdoptionStatus
}
