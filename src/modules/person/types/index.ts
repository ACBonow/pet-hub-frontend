/**
 * @module person
 * @file types/index.ts
 * @description TypeScript types for the person module.
 */

export interface Person {
  id: string
  name: string
  email: string
  cpf: string
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePersonData {
  name: string
  cpf: string
  phone?: string
}

export interface UpdatePersonData {
  name?: string
  phone?: string | null
}
