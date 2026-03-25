/**
 * @module person
 * @file usePerson.test.ts
 * @description Tests for the usePerson hook.
 */

import { renderHook, act } from '@testing-library/react'
import { usePerson } from '@/modules/person/hooks/usePerson'
import * as personService from '@/modules/person/services/person.service'

jest.mock('@/modules/person/services/person.service')

const mockPersonService = personService as jest.Mocked<typeof personService>

const mockPerson = {
  id: 'person-1',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '52998224725',
  phone: null,
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

describe('usePerson', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPerson', () => {
    it('should fetch and return person data', async () => {
      mockPersonService.getPersonRequest.mockResolvedValueOnce(mockPerson)

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.getPerson('person-1')
      })

      expect(result.current.person).toEqual(mockPerson)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should set isLoading true during fetch', async () => {
      let resolvePromise!: (v: typeof mockPerson) => void
      mockPersonService.getPersonRequest.mockReturnValueOnce(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const { result } = renderHook(() => usePerson())

      act(() => {
        result.current.getPerson('person-1')
      })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolvePromise(mockPerson)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when fetch fails', async () => {
      mockPersonService.getPersonRequest.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Pessoa não encontrada.',
      })

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.getPerson('person-1').catch(() => {})
      })

      expect(result.current.error).toBe('Pessoa não encontrada.')
      expect(result.current.person).toBeNull()
    })
  })

  describe('getMe', () => {
    it('should fetch the current user profile', async () => {
      mockPersonService.getMeRequest.mockResolvedValueOnce(mockPerson)

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.getMe()
      })

      expect(result.current.person).toEqual(mockPerson)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set person to null and set error on 404', async () => {
      mockPersonService.getMeRequest.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Perfil não encontrado.',
      })

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.getMe().catch(() => {})
      })

      expect(result.current.person).toBeNull()
    })
  })

  describe('createPerson', () => {
    it('should create person and set it in state', async () => {
      mockPersonService.createPersonRequest.mockResolvedValueOnce(mockPerson)

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.createPerson({ name: 'João Silva', cpf: '52998224725' })
      })

      expect(result.current.person).toEqual(mockPerson)
    })

    it('should throw when creation fails', async () => {
      mockPersonService.createPersonRequest.mockRejectedValueOnce({
        code: 'INVALID_CPF',
        message: 'CPF inválido.',
      })

      const { result } = renderHook(() => usePerson())

      await expect(
        act(async () => {
          await result.current.createPerson({ name: 'João', cpf: '11111111111' })
        }),
      ).rejects.toMatchObject({ code: 'INVALID_CPF' })
    })
  })

  describe('updatePerson', () => {
    it('should update person and reflect in state', async () => {
      const updated = { ...mockPerson, name: 'João da Silva' }
      mockPersonService.updatePersonRequest.mockResolvedValueOnce(updated)

      const { result } = renderHook(() => usePerson())

      await act(async () => {
        await result.current.updatePerson('person-1', { name: 'João da Silva' })
      })

      expect(result.current.person).toEqual(updated)
    })

    it('should throw when update fails', async () => {
      mockPersonService.updatePersonRequest.mockRejectedValueOnce({
        code: 'VALIDATION_ERROR',
        message: 'Nome inválido.',
      })

      const { result } = renderHook(() => usePerson())

      await expect(
        act(async () => {
          await result.current.updatePerson('person-1', { name: '' })
        }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
    })
  })
})
