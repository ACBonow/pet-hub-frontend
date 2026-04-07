/**
 * @module lost-found
 * @file LostFoundEditPage.test.tsx
 * @description Tests for LostFoundEditPage — edit mode and Editar link in DetailPage.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LostFoundEditPage from '@/modules/lost-found/pages/LostFoundEditPage'
import LostFoundDetailPage from '@/modules/lost-found/pages/LostFoundDetailPage'
import type { LostFoundReport } from '@/modules/lost-found/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

let mockParams: { id?: string } = {}

const mockGetReport = jest.fn()
const mockUpdateReport = jest.fn()
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
    updateReport: mockUpdateReport,
    updateStatus: mockUpdateStatus,
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
  description: 'Gata cinza, muito dócil.',
  location: null,
  addressStreet: 'Rua das Flores',
  addressNeighborhood: 'Centro',
  addressNumber: '10',
  addressCep: '01310-100',
  addressCity: 'São Paulo',
  addressState: 'SP',
  addressNotes: 'Próximo ao parque',
  photoUrl: null,
  contactEmail: 'joao@example.com',
  contactPhone: '11999990000',
  reporterId: 'person-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderEditAt = (path = '/achados-perdidos/report-1/editar') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/achados-perdidos/:id/editar" element={<LostFoundEditPage />} />
      </Routes>
    </MemoryRouter>,
  )

const renderDetailAt = (path = '/achados-perdidos/report-1') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/achados-perdidos/:id" element={<LostFoundDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('LostFoundEditPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'report-1' }
    mockReport = null
    mockIsLoading = false
    mockGetReport.mockResolvedValue(undefined)
    mockUpdateReport.mockResolvedValue(undefined)
    mockUpdateStatus.mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
  })

  it('calls getReport with id from params on mount', async () => {
    renderEditAt()
    await waitFor(() => {
      expect(mockGetReport).toHaveBeenCalledWith('report-1')
    })
  })

  it('shows loading indicator when isLoading and no report', () => {
    mockIsLoading = true
    mockReport = null
    renderEditAt()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('populates form fields with existing report data', () => {
    mockReport = MOCK_REPORT
    renderEditAt()
    expect(screen.getByDisplayValue('Gata cinza, muito dócil.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('11999990000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument()
  })

  it('calls updateReport with id on submit', async () => {
    mockReport = MOCK_REPORT
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(mockUpdateReport).toHaveBeenCalledWith('report-1', expect.any(Object))
    })
  })

  it('navigates to detail page after saving', async () => {
    mockReport = MOCK_REPORT
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/achados-perdidos/report-1')
    })
  })

  it('shows API error when update fails', async () => {
    mockReport = MOCK_REPORT
    mockUpdateReport.mockRejectedValueOnce({ message: 'Erro ao atualizar relatório.' })
    renderEditAt()
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar relatório.')).toBeInTheDocument()
    })
  })
})

describe('LostFoundDetailPage — Editar button', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'report-1' }
    mockReport = MOCK_REPORT
    mockGetReport.mockResolvedValue(undefined)
    mockUpdateStatus.mockResolvedValue(undefined)
  })

  it('shows Editar link when user is the creator', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'person-1' },
    } as any)
    renderDetailAt()
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('does NOT show Editar link for non-creator user', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'person-2' },
    } as any)
    renderDetailAt()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('does NOT show Editar link for unauthenticated user', () => {
    mockUseAuthStore.mockReturnValue({ user: null } as any)
    renderDetailAt()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })
})
