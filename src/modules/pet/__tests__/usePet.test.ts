/**
 * @module pet
 * @file usePet.test.ts
 * @description Tests for the usePet hook.
 */

import { renderHook, act } from '@testing-library/react'
import { usePet } from '@/modules/pet/hooks/usePet'
import * as petService from '@/modules/pet/services/pet.service'

jest.mock('@/modules/pet/services/pet.service')

const mockPetService = petService as jest.Mocked<typeof petService>

const mockPet = {
  id: 'pet-1',
  name: 'Rex',
  species: 'dog',
  breed: 'Labrador',
  birthDate: '2022-01-15',
  photoUrl: null,
  primaryTutorId: 'person-1',
  primaryTutorshipType: 'OWNER' as const,
  coTutorIds: [],
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

const mockTutorshipHistory = [
  {
    id: 'history-1',
    petId: 'pet-1',
    tutorId: 'person-1',
    tutorName: 'João Silva',
    type: 'OWNER' as const,
    startDate: '2022-01-15',
    endDate: null,
  },
]

describe('usePet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPet', () => {
    it('should fetch and return pet data', async () => {
      mockPetService.getPetRequest.mockResolvedValueOnce(mockPet)

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.getPet('pet-1')
      })

      expect(result.current.pet).toEqual(mockPet)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should set isLoading true during fetch', async () => {
      let resolvePromise!: (v: typeof mockPet) => void
      mockPetService.getPetRequest.mockReturnValueOnce(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const { result } = renderHook(() => usePet())

      act(() => {
        result.current.getPet('pet-1')
      })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolvePromise(mockPet)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when fetch fails', async () => {
      mockPetService.getPetRequest.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Pet não encontrado.',
      })

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.getPet('pet-1').catch(() => {})
      })

      expect(result.current.error).toBe('Pet não encontrado.')
      expect(result.current.pet).toBeNull()
    })
  })

  describe('listPets', () => {
    it('should fetch and return pets list', async () => {
      mockPetService.listPetsRequest.mockResolvedValueOnce([mockPet])

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.listPets()
      })

      expect(result.current.pets).toEqual([mockPet])
      expect(result.current.isLoading).toBe(false)
    })

    it('should set error when list fetch fails', async () => {
      mockPetService.listPetsRequest.mockRejectedValueOnce({
        code: 'INTERNAL_ERROR',
        message: 'Erro ao carregar pets.',
      })

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.listPets().catch(() => {})
      })

      expect(result.current.error).toBe('Erro ao carregar pets.')
    })
  })

  describe('createPet', () => {
    it('should create pet and set it in state', async () => {
      mockPetService.createPetRequest.mockResolvedValueOnce(mockPet)

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.createPet({ name: 'Rex', species: 'dog' })
      })

      expect(result.current.pet).toEqual(mockPet)
    })

    it('should throw when creation fails', async () => {
      mockPetService.createPetRequest.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Perfil de pessoa do usuário não encontrado.',
      })

      const { result } = renderHook(() => usePet())

      await expect(
        act(async () => {
          await result.current.createPet({ name: 'Rex', species: 'dog' })
        }),
      ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    })
  })

  describe('transferTutorship', () => {
    it('should transfer tutorship and update pet state', async () => {
      const updated = { ...mockPet }
      mockPetService.transferTutorshipRequest.mockResolvedValueOnce(updated)

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.transferTutorship('pet-1', {
          newTutorCpf: '52998224725',
          tutorshipType: 'TUTOR',
        })
      })

      expect(result.current.pet).toEqual(updated)
    })
  })

  describe('getTutorshipHistory', () => {
    it('should fetch and return tutorship history', async () => {
      mockPetService.getTutorshipHistoryRequest.mockResolvedValueOnce(mockTutorshipHistory)

      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.getTutorshipHistory('pet-1')
      })

      expect(result.current.tutorshipHistory).toEqual(mockTutorshipHistory)
    })
  })

  describe('uploadPhoto', () => {
    it('should upload photo and update pet state', async () => {
      const petWithPhoto = { ...mockPet, photoUrl: 'https://storage.example.com/photo.jpg' }
      mockPetService.uploadPetPhotoRequest.mockResolvedValueOnce(petWithPhoto)

      const file = new File(['fake'], 'photo.jpg', { type: 'image/jpeg' })
      const { result } = renderHook(() => usePet())

      await act(async () => {
        await result.current.uploadPhoto('pet-1', file)
      })

      expect(mockPetService.uploadPetPhotoRequest).toHaveBeenCalledWith('pet-1', file)
      expect(result.current.pet?.photoUrl).toBe(petWithPhoto.photoUrl)
    })

    it('should return the updated pet', async () => {
      const petWithPhoto = { ...mockPet, photoUrl: 'https://storage.example.com/photo.jpg' }
      mockPetService.uploadPetPhotoRequest.mockResolvedValueOnce(petWithPhoto)

      const file = new File(['fake'], 'photo.jpg', { type: 'image/jpeg' })
      const { result } = renderHook(() => usePet())

      let returned: typeof mockPet | undefined
      await act(async () => {
        returned = await result.current.uploadPhoto('pet-1', file)
      })

      expect(returned).toEqual(petWithPhoto)
    })
  })
})
