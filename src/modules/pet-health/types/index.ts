/**
 * @module pet-health
 * @file types/index.ts
 * @description TypeScript types for the pet-health module.
 */

export interface Vaccination {
  id: string
  name: string
  applicationDate: string
  nextDoseDate: string | null
  notes: string | null
}

export interface CreateVaccinationData {
  name: string
  applicationDate: string
  nextDoseDate?: string | null
  notes?: string | null
}

export type ExamFileType = 'PDF' | 'IMAGE' | 'OTHER'

export interface ExamFile {
  id: string
  name: string
  fileUrl: string
  examDate: string
  fileType: ExamFileType
}

export interface UploadExamData {
  name: string
  examDate: string
  file: File
}
