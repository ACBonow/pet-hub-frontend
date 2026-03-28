/**
 * @module organization
 * @file useOrganization.test.ts
 * @description Tests for the useOrganization hook.
 */

import { renderHook, act } from '@testing-library/react'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import * as organizationService from '@/modules/organization/services/organization.service'

jest.mock('@/modules/organization/services/organization.service')

const mockOrganizationService = organizationService as jest.Mocked<typeof organizationService>

const mockOrganization = {
  id: 'org-1',
  name: 'Pet Care LTDA',
  type: 'COMPANY' as const,
  cnpj: '11222333000181',
  email: 'contato@petcare.com',
  phone: '11999999999',
  description: 'Empresa de cuidados com animais',
  website: null,
  instagram: null,
  addressStreet: null,
  addressNeighborhood: null,
  addressNumber: null,
  addressCep: null,
  addressCity: null,
  addressState: null,
  responsiblePersonIds: ['person-1'],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

const mockNGO = {
  id: 'org-2',
  name: 'Amigos dos Pets',
  type: 'NGO' as const,
  cnpj: null,
  email: 'contato@amigospets.org',
  phone: null,
  description: null,
  website: null,
  instagram: null,
  addressStreet: null,
  addressNeighborhood: null,
  addressNumber: null,
  addressCep: null,
  addressCity: null,
  addressState: null,
  responsiblePersonIds: ['person-2'],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

describe('useOrganization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOrganization', () => {
    it('should fetch and return organization data', async () => {
      mockOrganizationService.getOrganizationRequest.mockResolvedValueOnce(mockOrganization)

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.getOrganization('org-1')
      })

      expect(result.current.organization).toEqual(mockOrganization)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should set isLoading true during fetch', async () => {
      let resolvePromise!: (v: typeof mockOrganization) => void
      mockOrganizationService.getOrganizationRequest.mockReturnValueOnce(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const { result } = renderHook(() => useOrganization())

      act(() => {
        result.current.getOrganization('org-1')
      })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolvePromise(mockOrganization)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when fetch fails', async () => {
      mockOrganizationService.getOrganizationRequest.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Organização não encontrada.',
      })

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.getOrganization('org-1').catch(() => {})
      })

      expect(result.current.error).toBe('Organização não encontrada.')
      expect(result.current.organization).toBeNull()
    })
  })

  describe('listOrganizations', () => {
    it('should fetch and return organizations list', async () => {
      const list = [mockOrganization, mockNGO]
      mockOrganizationService.listOrganizationsRequest.mockResolvedValueOnce(list)

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.listOrganizations()
      })

      expect(result.current.organizations).toEqual(list)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when list fetch fails', async () => {
      mockOrganizationService.listOrganizationsRequest.mockRejectedValueOnce({
        code: 'INTERNAL_ERROR',
        message: 'Erro ao carregar organizações.',
      })

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.listOrganizations().catch(() => {})
      })

      expect(result.current.error).toBe('Erro ao carregar organizações.')
    })
  })

  describe('createOrganization', () => {
    it('should create organization and set it in state', async () => {
      mockOrganizationService.createOrganizationRequest.mockResolvedValueOnce(mockOrganization)

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.createOrganization({
          name: 'Pet Care LTDA',
          type: 'COMPANY',
          cnpj: '11222333000181',
          responsiblePersonIds: ['person-1'],
        })
      })

      expect(result.current.organization).toEqual(mockOrganization)
    })

    it('should throw when creation fails', async () => {
      mockOrganizationService.createOrganizationRequest.mockRejectedValueOnce({
        code: 'VALIDATION_ERROR',
        message: 'CNPJ inválido.',
      })

      const { result } = renderHook(() => useOrganization())

      await expect(
        act(async () => {
          await result.current.createOrganization({
            name: 'Test',
            type: 'COMPANY',
            cnpj: '00000000000000',
            responsiblePersonIds: ['person-1'],
          })
        }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
    })
  })

  describe('updateOrganization', () => {
    it('should update organization and reflect in state', async () => {
      const updated = { ...mockOrganization, name: 'Pet Care Brasil LTDA' }
      mockOrganizationService.updateOrganizationRequest.mockResolvedValueOnce(updated)

      const { result } = renderHook(() => useOrganization())

      await act(async () => {
        await result.current.updateOrganization('org-1', { name: 'Pet Care Brasil LTDA' })
      })

      expect(result.current.organization).toEqual(updated)
    })
  })
})
