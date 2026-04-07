/**
 * @module lost-found
 * @file types/index.ts
 * @description TypeScript types for the lost-found module.
 */

export type LostFoundType = 'LOST' | 'FOUND'
export type LostFoundStatus = 'OPEN' | 'RESOLVED'

export interface CreatorInfo {
  type: 'person' | 'org'
  name: string
  photoUrl?: string | null
}

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
  createdBy?: CreatorInfo
  createdAt: string
  updatedAt: string
}

export interface LostFoundFilters {
  type?: LostFoundType
  status?: LostFoundStatus
  species?: string
  organizationId?: string
  page?: number
  pageSize?: number
}

export interface PaginatedLostFoundReports {
  data: LostFoundReport[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
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
  organizationId?: string | null
}
