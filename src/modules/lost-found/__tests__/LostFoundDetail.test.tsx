/**
 * @module lost-found
 * @file LostFoundDetail.test.tsx
 * @description Tests for LostFoundDetailPage — ContactGate behavior (auth vs non-auth),
 * loading/error states, address display, status badge.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LostFoundDetailPage from '@/modules/lost-found/pages/LostFoundDetailPage'
import type { LostFoundReport } from '@/modules/lost-found/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockGetReport = jest.fn()

jest.mock('@/modules/lost-found/hooks/useLostFound', () => ({
  useLostFound: () => ({
    report: mockReport,
    isLoading: mockIsLoading,
    error: mockError,
    reports: [],
    getReport: mockGetReport,
    createReport: jest.fn(),
    uploadPhoto: jest.fn(),
  }),
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// ─── Fixtures ────────────────────────────────────────────────────────────────

let mockReport: LostFoundReport | null = null
let mockIsLoading = false
let mockError: string | null = null

const MOCK_REPORT: LostFoundReport = {
  id: 'report-1',
  type: 'LOST',
  status: 'OPEN',
  petName: 'Rex',
  species: 'dog',
  description: 'Cachorro perdido no parque.',
  location: 'Parque Ibirapuera',
  addressStreet: 'Av. Pedro Álvares Cabral',
  addressNumber: 's/n',
  addressNeighborhood: 'Vila Mariana',
  addressCep: '04094-050',
  addressCity: 'São Paulo',
  addressState: 'SP',
  addressNotes: 'Próximo ao portão principal',
  photoUrl: null,
  contactEmail: 'joao@example.com',
  contactPhone: '11999990001',
  reporterId: 'person-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

const MOCK_FOUND_REPORT: LostFoundReport = {
  ...MOCK_REPORT,
  id: 'report-2',
  type: 'FOUND',
  petName: 'Gato encontrado',
  species: 'cat',
  description: 'Gato encontrado na rua.',
}

const MOCK_RESOLVED_REPORT: LostFoundReport = {
  ...MOCK_REPORT,
  status: 'RESOLVED',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderAt = (path = '/achados-perdidos/report-1') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/achados-perdidos/:id" element={<LostFoundDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('LostFoundDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockReport = null
    mockIsLoading = false
    mockError = null
    mockGetReport.mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
  })

  it('should call getReport with the id from params on mount', async () => {
    renderAt()
    await waitFor(() => {
      expect(mockGetReport).toHaveBeenCalledWith('report-1')
    })
  })

  it('should show loading indicator while loading', () => {
    mockIsLoading = true
    renderAt()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('should show error message when fetch fails', () => {
    mockError = 'Relatório não encontrado.'
    renderAt()
    expect(screen.getByRole('alert')).toHaveTextContent('Relatório não encontrado.')
  })

  describe('with report loaded', () => {
    beforeEach(() => {
      mockReport = MOCK_REPORT
    })

    it('should show Perdido badge for LOST report', () => {
      renderAt()
      expect(screen.getByText('Perdido')).toBeInTheDocument()
    })

    it('should show Achado badge for FOUND report', () => {
      mockReport = MOCK_FOUND_REPORT
      renderAt()
      expect(screen.getByText('Achado')).toBeInTheDocument()
    })

    it('should show Resolvido badge when status is RESOLVED', () => {
      mockReport = MOCK_RESOLVED_REPORT
      renderAt()
      expect(screen.getByText('Resolvido')).toBeInTheDocument()
    })

    it('should display pet name', () => {
      renderAt()
      expect(screen.getByText('Rex')).toBeInTheDocument()
    })

    it('should display description', () => {
      renderAt()
      expect(screen.getByText('Cachorro perdido no parque.')).toBeInTheDocument()
    })

    it('should display formatted address', () => {
      renderAt()
      expect(screen.getByText(/Av. Pedro Álvares Cabral/)).toBeInTheDocument()
    })

    it('should display address notes', () => {
      renderAt()
      expect(screen.getByText('Próximo ao portão principal')).toBeInTheDocument()
    })

    it('should render Google Maps link when address is available', () => {
      renderAt()
      const mapsLink = screen.getByRole('link', { name: /ver no google maps/i })
      expect(mapsLink).toBeInTheDocument()
      expect(mapsLink).toHaveAttribute('href', expect.stringContaining('google.com/maps'))
    })

    it('should show photo when photoUrl is provided', () => {
      mockReport = { ...MOCK_REPORT, photoUrl: 'https://example.com/photo.jpg' }
      renderAt()
      expect(screen.getByRole('img', { name: 'Rex' })).toBeInTheDocument()
    })
  })

  describe('ContactGate — unauthenticated', () => {
    beforeEach(() => {
      mockReport = MOCK_REPORT
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
    })

    it('should show login CTAs instead of contact info', () => {
      renderAt()
      // Both email and phone ContactGates render login CTAs
      expect(screen.getAllByRole('link', { name: /fazer login/i }).length).toBeGreaterThanOrEqual(1)
      expect(screen.queryByText('joao@example.com')).not.toBeInTheDocument()
      expect(screen.queryByText('11999990001')).not.toBeInTheDocument()
    })
  })

  describe('ContactGate — authenticated', () => {
    beforeEach(() => {
      mockReport = MOCK_REPORT
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true } as any)
    })

    it('should show email as mailto link', () => {
      renderAt()
      const link = screen.getByRole('link', { name: 'joao@example.com' })
      expect(link).toHaveAttribute('href', 'mailto:joao@example.com')
    })

    it('should show phone as tel link', () => {
      renderAt()
      const link = screen.getByRole('link', { name: '11999990001' })
      expect(link).toHaveAttribute('href', 'tel:11999990001')
    })

    it('should not show the login CTA', () => {
      renderAt()
      expect(screen.queryByText(/fazer login/i)).not.toBeInTheDocument()
    })
  })

  describe('ContactGate — null values', () => {
    it('should render nothing for null contactEmail', () => {
      mockReport = { ...MOCK_REPORT, contactEmail: null, contactPhone: null }
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true } as any)
      renderAt()
      expect(screen.queryByRole('link', { name: /fazer login/i })).not.toBeInTheDocument()
    })
  })
})
