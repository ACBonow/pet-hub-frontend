/**
 * @module pet-health
 * @file types/index.ts
 * @description TypeScript types for the pet-health module.
 */

export interface Vaccination {
  id: string
  petId: string
  templateId: string | null
  doseNumber: number | null
  vaccineName: string
  manufacturer: string | null
  batchNumber: string | null
  applicationDate: string
  nextDueDate: string | null
  veterinarianName: string | null
  clinicName: string | null
  fileUrl: string | null
  notes: string | null
  createdAt: string
}

export interface CreateVaccinationData {
  templateId?: string
  vaccineName: string
  manufacturer?: string
  batchNumber?: string
  applicationDate: string
  nextDueDate?: string | null
  veterinarianName?: string
  clinicName?: string
  notes?: string | null
}

// ─── Vaccine Catalog ──────────────────────────────────────────────────────────

export type VaccineTemplateType = 'VACCINE' | 'PREVENTIVE'
export type VaccineCategory = 'CORE' | 'NON_CORE' | 'LIFESTYLE'
export type PetSpecies = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER'
export type PreventiveType = 'FLEA' | 'TICK' | 'FLEA_TICK' | 'DEWORMER' | 'HEARTWORM' | 'OTHER'

export interface VaccineBrand {
  id: string
  brandName: string
  manufacturer: string
  presentation: string | null
}

export interface VaccineTemplate {
  id: string
  name: string
  slug: string
  type: VaccineTemplateType
  species: PetSpecies[]
  category: VaccineCategory
  preventiveType: PreventiveType | null
  isRequiredByLaw: boolean
  initialDosesCount: number
  initialIntervalDays: number
  boosterIntervalDays: number
  notes: string | null
  brands: VaccineBrand[]
}

// ─── Vaccine Status ───────────────────────────────────────────────────────────

export type VaccineStatusValue = 'UP_TO_DATE' | 'DUE_SOON' | 'OVERDUE' | 'NOT_GIVEN'

export interface VaccineStatusEntry {
  templateId: string
  templateName: string
  slug: string
  category: string
  preventiveType: string | null
  isRequiredByLaw: boolean
  status: VaccineStatusValue
  daysOverdue: number | null
  lastDoseDate: string | null
  nextDueDate: string | null
  totalDosesGiven: number
}

// ─── Preventive Records ───────────────────────────────────────────────────────

export interface PreventiveRecord {
  id: string
  petId: string
  templateId: string | null
  productName: string
  appliedAt: string
  nextDueDate: string | null
  brand: string | null
  batchNumber: string | null
  notes: string | null
  createdAt: string
}

export interface CreatePreventiveData {
  templateId?: string
  productName: string
  appliedAt: string
  nextDueDate?: string
  brand?: string
  notes?: string
}

export interface ExamFile {
  id: string
  petId: string
  examType: string
  fileUrl: string
  examDate: string
  labName: string | null
  notes: string | null
  createdAt: string
}

export interface UploadExamData {
  examType: string
  examDate: string
  file: File
  labName?: string
  notes?: string
}
