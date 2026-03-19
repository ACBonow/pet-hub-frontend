/**
 * @module services-directory
 * @file types/index.ts
 * @description TypeScript types for the services-directory module.
 */

export type ServiceType =
  | 'VETERINARIAN'
  | 'CLINIC'
  | 'EXAM'
  | 'PHARMACY'
  | 'GROOMING'
  | 'BOARDING'
  | 'TRANSPORT'
  | 'OTHER'

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  VETERINARIAN: 'Veterinário',
  CLINIC: 'Clínica',
  EXAM: 'Exames',
  PHARMACY: 'Farmácia de Manipulação',
  GROOMING: 'Banho e Tosa',
  BOARDING: 'Hospedaria',
  TRANSPORT: 'Transporte',
  OTHER: 'Outro',
}

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  VETERINARIAN: 'bg-blue-100 text-blue-800',
  CLINIC: 'bg-green-100 text-green-800',
  EXAM: 'bg-purple-100 text-purple-800',
  PHARMACY: 'bg-orange-100 text-orange-800',
  GROOMING: 'bg-pink-100 text-pink-800',
  BOARDING: 'bg-yellow-100 text-yellow-800',
  TRANSPORT: 'bg-indigo-100 text-indigo-800',
  OTHER: 'bg-gray-100 text-gray-800',
}

export interface ServiceListing {
  id: string
  name: string
  type: ServiceType
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  organizationId: string | null
  createdAt: string
  updatedAt: string
}

export interface ServiceFilters {
  type?: ServiceType
  name?: string
  page?: number
  pageSize?: number
}

export interface PaginatedServiceListings {
  data: ServiceListing[]
  total: number
  page: number
  pageSize: number
}

export interface CreateServiceData {
  name: string
  type: ServiceType
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  organizationId?: string
}

export interface UpdateServiceData {
  name?: string
  type?: ServiceType
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  organizationId?: string
}
