/**
 * @module pet
 * @file PetDelete.test.tsx
 * @description Tests for delete pet functionality in PetDetailPage.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PetDetailPage from '@/modules/pet/pages/PetDetailPage'
import type { Pet } from '@/modules/pet/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'pet-1' }),
}))

const mockGetPet = jest.fn()
const mockDeletePet = jest.fn()

let mockPet: Pet | null = null
let mockIsLoading = false

jest.mock('@/modules/pet/hooks/usePet', () => ({
  usePet: () => ({
    pet: mockPet,
    pets: [],
    tutorshipHistory: [],
    isLoading: mockIsLoading,
    error: null,
    getPet: mockGetPet,
    listPets: jest.fn(),
    createPet: jest.fn(),
    updatePet: jest.fn(),
    deletePet: mockDeletePet,
    transferTutorship: jest.fn(),
    getTutorshipHistory: jest.fn(),
    uploadPhoto: jest.fn(),
    addCoTutor: jest.fn(),
    removeCoTutor: jest.fn(),
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('@/modules/pet/components/TutorshipInfo', () => ({ __esModule: true, default: () => <div /> }))
jest.mock('@/modules/pet/components/TutorshipTransfer', () => ({ __esModule: true, default: () => <div /> }))
jest.mock('@/modules/pet/components/CoTutorsList', () => ({ __esModule: true, default: () => <div /> }))
jest.mock('@/modules/pet/components/TutorshipHistory', () => ({ __esModule: true, default: () => <div /> }))
jest.mock('@/shared/components/forms/CpfInput', () => ({
  __esModule: true,
  default: ({ name, control }: { name: string; control: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useController } = require('react-hook-form')
    const { field } = useController({ name, control, defaultValue: '' })
    return <input id={name} {...field} />
  },
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_PET: Pet = {
  id: 'pet-1',
  name: 'Rex',
  species: 'dog',
  breed: null,
  gender: null,
  castrated: null,
  birthDate: null,
  photoUrl: null,
  primaryTutorId: 'person-1',
  primaryTutorshipType: 'OWNER',
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/pets/pet-1']}>
      <Routes>
        <Route path="/pets/:id" element={<PetDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PetDetailPage — delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPet = MOCK_PET
    mockIsLoading = false
    mockGetPet.mockResolvedValue(undefined)
    mockDeletePet.mockResolvedValue(undefined)
  })

  describe('tutor', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
      } as any)
    })

    it('shows Excluir button for the primary tutor', () => {
      renderDetail()
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()
    })

    it('shows confirmation step when Excluir clicked', () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      expect(screen.getByRole('button', { name: /confirmar exclusão/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })

    it('hides confirmation when Cancelar clicked', () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
      expect(screen.queryByRole('button', { name: /confirmar exclusão/i })).not.toBeInTheDocument()
    })

    it('calls deletePet with pet id when confirmed', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockDeletePet).toHaveBeenCalledWith('pet-1')
      })
    })

    it('navigates to /pets after deletion', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/pets')
      })
    })
  })

  describe('non-tutor', () => {
    it('does NOT show Excluir button for a different user', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
      } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })

    it('does NOT show Excluir button for unauthenticated user', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })
  })
})
