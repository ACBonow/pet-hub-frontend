/**
 * @module adoption
 * @file AdoptionEditPage.test.tsx
 * @description Tests for AdoptionEditPage — edit mode and Editar link in DetailPage.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdoptionEditPage from '@/modules/adoption/pages/AdoptionEditPage'
import AdoptionDetailPage from '@/modules/adoption/pages/AdoptionDetailPage'
import type { AdoptionListing } from '@/modules/adoption/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

let mockParams: { id?: string } = {}

const mockGetAdoption = jest.fn()
const mockUpdateAdoption = jest.fn()
const mockUpdateAdoptionStatus = jest.fn()

let mockListing: AdoptionListing | null = null
let mockIsLoading = false

jest.mock('@/modules/adoption/hooks/useAdoption', () => ({
  useAdoption: () => ({
    listing: mockListing,
    listings: [],
    isLoading: mockIsLoading,
    error: null,
    currentPage: 1,
    totalPages: 1,
    listAdoptions: jest.fn(),
    getAdoption: mockGetAdoption,
    createAdoption: jest.fn(),
    updateAdoption: mockUpdateAdoption,
    updateAdoptionStatus: mockUpdateAdoptionStatus,
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_LISTING: AdoptionListing = {
  id: 'adoption-1',
  petId: 'pet-1',
  petName: 'Rex',
  species: 'dog',
  breed: null,
  photoUrl: null,
  gender: null,
  castrated: null,
  description: 'Cachorro dócil.',
  status: 'AVAILABLE',
  contactEmail: 'contato@example.com',
  contactPhone: '11999990000',
  contactWhatsapp: '11988880000',
  organizationId: null,
  personId: 'person-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderEditAt = (path = '/adocao/adoption-1/editar') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/adocao/:id/editar" element={<AdoptionEditPage />} />
      </Routes>
    </MemoryRouter>,
  )

const renderDetailAt = (path = '/adocao/adoption-1') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/adocao/:id" element={<AdoptionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AdoptionEditPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'adoption-1' }
    mockListing = null
    mockIsLoading = false
    mockGetAdoption.mockResolvedValue(undefined)
    mockUpdateAdoption.mockResolvedValue(undefined)
    mockUpdateAdoptionStatus.mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
  })

  it('calls getAdoption with id from params on mount', async () => {
    renderEditAt()
    await waitFor(() => {
      expect(mockGetAdoption).toHaveBeenCalledWith('adoption-1')
    })
  })

  it('shows loading indicator when isLoading and no listing', () => {
    mockIsLoading = true
    mockListing = null
    renderEditAt()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('populates form fields with existing listing data', () => {
    mockListing = MOCK_LISTING
    renderEditAt()
    expect(screen.getByDisplayValue('Cachorro dócil.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('contato@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('11999990000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('11988880000')).toBeInTheDocument()
  })

  it('calls updateAdoption with id on submit', async () => {
    mockListing = MOCK_LISTING
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(mockUpdateAdoption).toHaveBeenCalledWith('adoption-1', expect.any(Object))
    })
  })

  it('navigates to detail page after saving', async () => {
    mockListing = MOCK_LISTING
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/adocao/adoption-1')
    })
  })

  it('shows API error when update fails', async () => {
    mockListing = MOCK_LISTING
    mockUpdateAdoption.mockRejectedValueOnce({ message: 'Erro ao atualizar.' })
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar.')).toBeInTheDocument()
    })
  })
})

describe('AdoptionDetailPage — Editar button', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'adoption-1' }
    mockListing = MOCK_LISTING
    mockGetAdoption.mockResolvedValue(undefined)
    mockUpdateAdoptionStatus.mockResolvedValue(undefined)
  })

  it('shows Editar link when user is the creator', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
    } as any)
    renderDetailAt()
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('does NOT show Editar link for non-creator user', () => {
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
