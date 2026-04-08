/**
 * @module lost-found
 * @file LostFoundDelete.test.tsx
 * @description Tests for delete lost-found report functionality in LostFoundDetailPage.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LostFoundDetailPage from '@/modules/lost-found/pages/LostFoundDetailPage'
import type { LostFoundReport } from '@/modules/lost-found/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'report-1' }),
}))

const mockGetReport = jest.fn()
const mockDeleteReport = jest.fn()
const mockUpdateStatus = jest.fn()

let mockReport: LostFoundReport | null = null
let mockIsLoading = false

jest.mock('@/modules/lost-found/hooks/useLostFound', () => ({
  useLostFound: () => ({
    report: mockReport,
    reports: [],
    isLoading: mockIsLoading,
    error: null,
    currentPage: 1,
    totalPages: 1,
    listReports: jest.fn(),
    getReport: mockGetReport,
    createReport: jest.fn(),
    updateReport: jest.fn(),
    updateStatus: mockUpdateStatus,
    deleteReport: mockDeleteReport,
    uploadPhoto: jest.fn(),
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_REPORT: LostFoundReport = {
  id: 'report-1',
  type: 'LOST',
  status: 'OPEN',
  petName: 'Luna',
  species: 'cat',
  description: 'Gata cinza.',
  location: null,
  addressStreet: null,
  addressNeighborhood: null,
  addressNumber: null,
  addressCep: null,
  addressCity: null,
  addressState: null,
  addressNotes: null,
  photoUrl: null,
  contactEmail: 'joao@example.com',
  contactPhone: null,
  reporterId: 'person-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/achados-perdidos/report-1']}>
      <Routes>
        <Route path="/achados-perdidos/:id" element={<LostFoundDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('LostFoundDetailPage — delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockReport = MOCK_REPORT
    mockIsLoading = false
    mockGetReport.mockResolvedValue(undefined)
    mockDeleteReport.mockResolvedValue(undefined)
    mockUpdateStatus.mockResolvedValue(undefined)
  })

  describe('creator', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
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

    it('calls deleteReport when confirm clicked', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockDeleteReport).toHaveBeenCalledWith('report-1')
      })
    })

    it('navigates to lost-found list after deletion', async () => {
      renderDetail()
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/achados-perdidos')
      })
    })
  })

  describe('non-creator', () => {
    it('does NOT show delete button for non-creator', () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
      } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })

    it('does NOT show delete button for unauthenticated user', () => {
      mockUseAuthStore.mockReturnValue({ user: null } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })

    it('does NOT show delete button for non-matching personId', () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user-3', email: 'c@d.com', name: 'C', personId: 'person-3' },
      } as any)
      renderDetail()
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
    })
  })
})
