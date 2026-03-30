/**
 * @module organization
 * @file types/index.ts
 * @description TypeScript types for the organization module.
 */

export type OrganizationType = 'COMPANY' | 'NGO'
export type OrgRole = 'OWNER' | 'MANAGER' | 'MEMBER'

export interface OrgMember {
  organizationId: string
  personId: string
  role: OrgRole
  assignedAt: string
}

export interface OrgResponsiblePerson {
  organizationId: string
  personId: string
  role: OrgRole
  assignedAt: string
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  cnpj: string | null
  email: string | null
  phone: string | null
  description: string | null
  website: string | null
  instagram: string | null
  photoUrl?: string | null
  addressStreet: string | null
  addressNeighborhood: string | null
  addressNumber: string | null
  addressCep: string | null
  addressCity: string | null
  addressState: string | null
  responsiblePersonIds: string[]
  responsiblePersons?: OrgResponsiblePerson[]
  myRole?: OrgRole
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationData {
  name: string
  type: OrganizationType
  cnpj?: string | null
  email?: string | null
  phone?: string | null
  description?: string | null
  website?: string | null
  instagram?: string | null
  addressStreet?: string | null
  addressNeighborhood?: string | null
  addressNumber?: string | null
  addressCep?: string | null
  addressCity?: string | null
  addressState?: string | null
  responsiblePersonIds?: string[] // optional — backend derives from JWT when absent
}

export interface UpdateOrganizationData {
  name?: string
  cnpj?: string | null
  email?: string | null
  phone?: string | null
  description?: string | null
  website?: string | null
  instagram?: string | null
  addressStreet?: string | null
  addressNeighborhood?: string | null
  addressNumber?: string | null
  addressCep?: string | null
  addressCity?: string | null
  addressState?: string | null
}
