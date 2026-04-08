/**
 * @module pet
 * @file PetEditPage.test.tsx
 * @description Tests for PetEditPage — edit mode and Editar link visibility in PetDetailPage.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PetEditPage from '@/modules/pet/pages/PetEditPage'
import PetDetailPage from '@/modules/pet/pages/PetDetailPage'
import type { Pet } from '@/modules/pet/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

let mockParams: { id?: string } = {}

const mockGetPet = jest.fn()
const mockUpdatePet = jest.fn()
const mockUploadPhoto = jest.fn()

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
    updatePet: mockUpdatePet,
    transferTutorship: jest.fn(),
    getTutorshipHistory: jest.fn(),
    uploadPhoto: mockUploadPhoto,
    addCoTutor: jest.fn(),
    removeCoTutor: jest.fn(),
    deletePet: jest.fn(),
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('@/modules/pet/components/TutorshipInfo', () => ({ __esModule: true, default: () => <div data-testid="tutorship-info" /> }))
jest.mock('@/modules/pet/components/TutorshipTransfer', () => ({ __esModule: true, default: () => <div data-testid="tutorship-transfer" /> }))
jest.mock('@/modules/pet/components/CoTutorsList', () => ({ __esModule: true, default: () => <div data-testid="co-tutors-list" /> }))
jest.mock('@/modules/pet/components/TutorshipHistory', () => ({ __esModule: true, default: () => <div data-testid="tutorship-history" /> }))
jest.mock('@/shared/components/forms/CpfInput', () => ({
  __esModule: true,
  default: ({ name, label, control }: { name: string; label?: string; control: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useController } = require('react-hook-form')
    const { field } = useController({ name, control, defaultValue: '' })
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input id={name} {...field} />
      </div>
    )
  },
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_PET: Pet = {
  id: 'pet-1',
  name: 'Rex',
  species: 'dog',
  breed: 'Labrador',
  gender: 'M',
  castrated: false,
  birthDate: '2022-01-15',
  photoUrl: null,
  primaryTutorId: 'person-1',
  primaryTutorshipType: 'OWNER',
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderEditAt = (path = '/pets/pet-1/editar') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/pets/:id/editar" element={<PetEditPage />} />
      </Routes>
    </MemoryRouter>,
  )

const renderDetailAt = (path = '/pets/pet-1') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/pets/:id" element={<PetDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests: PetEditPage ──────────────────────────────────────────────────────

describe('PetEditPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'pet-1' }
    mockPet = null
    mockIsLoading = false
    mockGetPet.mockResolvedValue(undefined)
    mockUpdatePet.mockResolvedValue(undefined)
    mockUploadPhoto.mockResolvedValue(MOCK_PET)
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
  })

  it('calls getPet with id from params on mount', async () => {
    renderEditAt()
    await waitFor(() => {
      expect(mockGetPet).toHaveBeenCalledWith('pet-1')
    })
  })

  it('shows loading indicator when isLoading and no pet', () => {
    mockIsLoading = true
    mockPet = null
    renderEditAt()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('populates form with existing pet name', () => {
    mockPet = MOCK_PET
    renderEditAt()
    expect(screen.getByDisplayValue('Rex')).toBeInTheDocument()
  })

  it('populates form with existing pet species', () => {
    mockPet = MOCK_PET
    renderEditAt()
    expect(screen.getByDisplayValue('Cão')).toBeInTheDocument()
  })

  it('calls updatePet with id on submit', async () => {
    mockPet = MOCK_PET
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(mockUpdatePet).toHaveBeenCalledWith('pet-1', expect.any(Object))
    })
  })

  it('navigates to detail page after saving', async () => {
    mockPet = MOCK_PET
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pets/pet-1')
    })
  })

  it('shows API error when update fails', async () => {
    mockPet = MOCK_PET
    mockUpdatePet.mockRejectedValueOnce({ message: 'Erro ao atualizar pet.' })
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar pet.')).toBeInTheDocument()
    })
  })
})

// ─── Tests: PetDetailPage — Editar link visibility ───────────────────────────

describe('PetDetailPage — link Editar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'pet-1' }
    mockPet = MOCK_PET
    mockGetPet.mockResolvedValue(undefined)
  })

  it('shows Editar link when user is the primary tutor', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
    } as any)
    renderDetailAt()
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('does NOT show Editar link for non-tutor user', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
    } as any)
    renderDetailAt()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('does NOT show Editar link for unauthenticated user', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
    renderDetailAt()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })
})
