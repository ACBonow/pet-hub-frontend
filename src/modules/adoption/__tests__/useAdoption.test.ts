/**
 * @module adoption
 * @file useAdoption.test.ts
 * @description Tests for the useAdoption hook.
 */

import { renderHook, act } from '@testing-library/react'
import { useAdoption } from '@/modules/adoption/hooks/useAdoption'
import * as adoptionService from '@/modules/adoption/services/adoption.service'

jest.mock('@/modules/adoption/services/adoption.service')

const mockAdoptionService = adoptionService as jest.Mocked<typeof adoptionService>

const mockAdoptionListing = {
  id: 'adoption-1',
  petId: 'pet-1',
  petName: 'Rex',
  species: 'dog',
  breed: 'Labrador',
  photoUrl: null,
  gender: null,
  castrated: null,
  description: 'Cachorro dócil e carinhoso.',
  status: 'AVAILABLE' as const,
  contactEmail: 'contato@petcare.com',
  contactPhone: null,
  contactWhatsapp: null,
  organizationId: null,
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

describe('useAdoption', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('listAdoptions', () => {
    it('should fetch and return adoption listings', async () => {
      mockAdoptionService.listAdoptionsRequest.mockResolvedValueOnce([mockAdoptionListing])

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.listAdoptions()
      })

      expect(result.current.listings).toEqual([mockAdoptionListing])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should filter by species when provided', async () => {
      mockAdoptionService.listAdoptionsRequest.mockResolvedValueOnce([mockAdoptionListing])

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.listAdoptions({ species: 'dog' })
      })

      expect(mockAdoptionService.listAdoptionsRequest).toHaveBeenCalledWith({ species: 'dog' }, expect.any(AbortSignal))
    })

    it('should set isLoading true during fetch', async () => {
      let resolvePromise!: (v: typeof mockAdoptionListing[]) => void
      mockAdoptionService.listAdoptionsRequest.mockReturnValueOnce(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const { result } = renderHook(() => useAdoption())

      act(() => {
        result.current.listAdoptions()
      })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolvePromise([mockAdoptionListing])
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when fetch fails', async () => {
      mockAdoptionService.listAdoptionsRequest.mockRejectedValueOnce({
        code: 'INTERNAL_ERROR',
        message: 'Erro ao carregar adoções.',
      })

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.listAdoptions().catch(() => {})
      })

      expect(result.current.error).toBe('Erro ao carregar adoções.')
    })
  })

  describe('getAdoption', () => {
    it('should fetch a single adoption listing', async () => {
      mockAdoptionService.getAdoptionRequest.mockResolvedValueOnce(mockAdoptionListing)

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.getAdoption('adoption-1')
      })

      expect(result.current.listing).toEqual(mockAdoptionListing)
    })
  })

  describe('createAdoption', () => {
    it('should create an adoption listing', async () => {
      mockAdoptionService.createAdoptionRequest.mockResolvedValueOnce(mockAdoptionListing)

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.createAdoption({
          petId: 'pet-1',
          description: 'Cachorro dócil',
          contactEmail: 'contato@email.com',
        })
      })

      expect(result.current.listing).toEqual(mockAdoptionListing)
    })
  })

  describe('updateAdoptionStatus', () => {
    it('should update the listing status and set listing state', async () => {
      const updated = { ...mockAdoptionListing, status: 'RESERVED' as const }
      mockAdoptionService.updateAdoptionStatusRequest.mockResolvedValueOnce(updated)

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.updateAdoptionStatus('adoption-1', 'RESERVED')
      })

      expect(mockAdoptionService.updateAdoptionStatusRequest).toHaveBeenCalledWith('adoption-1', 'RESERVED')
      expect(result.current.listing?.status).toBe('RESERVED')
      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when update fails', async () => {
      mockAdoptionService.updateAdoptionStatusRequest.mockRejectedValueOnce({
        code: 'INTERNAL_ERROR',
        message: 'Erro ao atualizar status.',
      })

      const { result } = renderHook(() => useAdoption())

      await act(async () => {
        await result.current.updateAdoptionStatus('adoption-1', 'ADOPTED').catch(() => {})
      })

      expect(result.current.error).toBe('Erro ao atualizar status.')
    })
  })
})
