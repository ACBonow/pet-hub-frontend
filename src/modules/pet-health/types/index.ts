/**
 * @module pet-health
 * @file types/index.ts
 * @description TypeScript types for the pet-health module.
 */

export interface Vaccination {
  id: string
  petId: string
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
  vaccineName: string
  manufacturer?: string
  batchNumber?: string
  applicationDate: string
  nextDueDate?: string | null
  veterinarianName?: string
  clinicName?: string
  notes?: string | null
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
