/**
 * @module adoption
 * @file useAdoption.ts
 * @description Hook for loading and managing adoption listings.
 */

import { useState, useRef, useEffect } from 'react'
import {
  listAdoptionsRequest,
  getAdoptionRequest,
  createAdoptionRequest,
  updateAdoptionRequest,
} from '@/modules/adoption/services/adoption.service'
import type { AdoptionListing, AdoptionFilters, CreateAdoptionData, UpdateAdoptionData } from '@/modules/adoption/types'
import type { ApiError } from '@/shared/types'

interface UseAdoptionResult {
  listing: AdoptionListing | null
  listings: AdoptionListing[]
  isLoading: boolean
  error: string | null
  listAdoptions: (filters?: AdoptionFilters) => Promise<void>
  getAdoption: (id: string) => Promise<void>
  createAdoption: (data: CreateAdoptionData) => Promise<void>
  updateAdoption: (id: string, data: UpdateAdoptionData) => Promise<void>
}

export function useAdoption(): UseAdoptionResult {
  const [listing, setListing] = useState<AdoptionListing | null>(null)
  const [listings, setListings] = useState<AdoptionListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function listAdoptions(filters?: AdoptionFilters): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await listAdoptionsRequest(filters, controller.signal)
      setListings(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar adoções.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getAdoption(id: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await getAdoptionRequest(id, controller.signal)
      setListing(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar anúncio de adoção.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createAdoption(data: CreateAdoptionData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createAdoptionRequest(data)
      setListing(created)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao criar anúncio de adoção.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function updateAdoption(id: string, data: UpdateAdoptionData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await updateAdoptionRequest(id, data)
      setListing(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao atualizar anúncio de adoção.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { listing, listings, isLoading, error, listAdoptions, getAdoption, createAdoption, updateAdoption }
}
