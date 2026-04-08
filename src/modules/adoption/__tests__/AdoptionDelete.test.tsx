/**
 * @module adoption
 * @file AdoptionDelete.test.tsx
 * @description Tests for delete adoption functionality in AdoptionDetailPage.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdoptionDetailPage from '@/modules/adoption/pages/AdoptionDetailPage'
import type { AdoptionListing } from '@/modules/adoption/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'adoption-1' }),
}))

const mockGetAdoption = jest.fn()
const mockDeleteAdoption = jest.fn()
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
    updateAdoption: jest.fn(),
    updateAdoptionStatus: mockUpdateAdoptionStatus,
    deleteAdoption: mockDeleteAdoption,
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
  contactPhone: null,
  contactWhatsapp: null,
  organizationId: null,
  personId: 'person-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/adocao/adoption-1']}>
      <Routes>
        <Route path="/adocao/:id" element={<AdoptionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AdoptionDetailPage — delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListing = MOCK_LISTING
    mockIsLoading = false
    mockGetAdoption.mockResolvedValue(undefined)
    mockDeleteAdoption.mockResolvedValue(undefined)
    mockUpdateAdoptionStatus.mockResolvedValue(undefined)
  })

  describe('creator', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
      } as any)
    })

    it('shows delete button for creator', () => {
      renderDetail()
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()
    })

    it('shows confirmation step when delete button clicked', () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      expect(screen.getByRole('button', { name: /confirmar exclusão/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })

    it('hides confirmation step when cancel clicked', () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
      expect(screen.queryByRole('button', { name: /confirmar exclusão/i })).not.toBeInTheDocument()
    })

    it('calls deleteAdoption when confirm clicked', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockDeleteAdoption).toHaveBeenCalledWith('adoption-1')
      })
    })

    it('navigates to adoption list after deletion', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/adocao')
      })
    })
  })

  describe('non-creator', () => {
    it('does NOT show delete button for non-creator', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
      } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })

    it('does NOT show delete button for unauthenticated user', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })

    it('does NOT show delete button for org listing without matching personId', () => {
      mockListing = { ...MOCK_LISTING, personId: null, organizationId: 'org-1' }
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
      } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })
  })
})
