/**
 * @module lost-found
 * @file types/index.ts
 * @description TypeScript types for the lost-found module.
 */

export type LostFoundType = 'LOST' | 'FOUND'
export type LostFoundStatus = 'OPEN' | 'RESOLVED'

export interface LostFoundReport {
  id: string
  type: LostFoundType
  status: LostFoundStatus
  petName: string | null
  species: string | null
  description: string
  location: string | null
  addressStreet: string | null
  addressNeighborhood: string | null
  addressNumber: string | null
  addressCep: string | null
  addressCity: string | null
  addressState: string | null
  addressNotes: string | null
  photoUrl: string | null
  contactEmail: string | null
  contactPhone: string | null
  reporterId: string
  createdAt: string
  updatedAt: string
}

export interface LostFoundFilters {
  type?: LostFoundType
  status?: LostFoundStatus
  species?: string
}

export interface CreateLostFoundData {
  type: LostFoundType
  petName?: string | null
  species?: string | null
  description: string
  location?: string | null
  addressStreet?: string | null
  addressNeighborhood?: string | null
  addressNumber?: string | null
  addressCep?: string | null
  addressCity?: string | null
  addressState?: string | null
  addressNotes?: string | null
  contactEmail: string
  contactPhone?: string | null
}
