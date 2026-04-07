/**
 * @module adoption
 * @file AdoptionDetailPage.test.tsx
 * @description Tests for AdoptionDetailPage — status update panel visibility and interactions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdoptionDetailPage from '@/modules/adoption/pages/AdoptionDetailPage'
import type { AdoptionListing } from '@/modules/adoption/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockGetAdoption = jest.fn()
const mockUpdateAdoptionStatus = jest.fn()

jest.mock('@/modules/adoption/hooks/useAdoption', () => ({
  useAdoption: () => ({
    listing: mockListing,
    isLoading: mockIsLoading,
    error: mockError,
    listings: [],
    getAdoption: mockGetAdoption,
    createAdoption: jest.fn(),
    updateAdoption: jest.fn(),
    updateAdoptionStatus: mockUpdateAdoptionStatus,
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

let mockListing: AdoptionListing | null = null
let mockIsLoading = false
let mockError: string | null = null

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderAt = (path = '/adocao/adoption-1') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/adocao/:id" element={<AdoptionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AdoptionDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListing = null
    mockIsLoading = false
    mockError = null
    mockGetAdoption.mockResolvedValue(undefined)
    mockUpdateAdoptionStatus.mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
  })

  it('calls getAdoption with id from params on mount', async () => {
    renderAt()
    await waitFor(() => {
      expect(mockGetAdoption).toHaveBeenCalledWith('adoption-1')
    })
  })

  describe('status update panel — creator', () => {
    beforeEach(() => {
      mockListing = MOCK_LISTING
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
      } as any)
    })

    it('shows status update buttons when user is the creator', () => {
      renderAt()
      expect(screen.getByRole('button', { name: /disponível/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reservado/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /adotado/i })).toBeInTheDocument()
    })

    it('currently active status button is disabled', () => {
      renderAt()
      // listing.status is AVAILABLE
      expect(screen.getByRole('button', { name: /disponível/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /reservado/i })).not.toBeDisabled()
    })

    it('calls updateAdoptionStatus with correct args when button clicked', async () => {
      renderAt()
      fireEvent.click(screen.getByRole('button', { name: /reservado/i }))
      await waitFor(() => {
        expect(mockUpdateAdoptionStatus).toHaveBeenCalledWith('adoption-1', 'RESERVED')
      })
    })
  })

  describe('status update panel — non-creator', () => {
    beforeEach(() => {
      mockListing = MOCK_LISTING
    })

    it('does not show status buttons when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
      renderAt()
      expect(screen.queryByRole('button', { name: /disponível/i })).not.toBeInTheDocument()
    })

    it('does not show status buttons when user has a different personId', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
      } as any)
      renderAt()
      expect(screen.queryByRole('button', { name: /disponível/i })).not.toBeInTheDocument()
    })

    it('does not show status buttons for an org listing when user has no personId match', () => {
      mockListing = { ...MOCK_LISTING, personId: null, organizationId: 'org-1' }
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
      } as any)
      renderAt()
      expect(screen.queryByRole('button', { name: /disponível/i })).not.toBeInTheDocument()
    })
  })
})
