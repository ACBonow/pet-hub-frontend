/**
 * @module services-directory
 * @file ServiceDelete.test.tsx
 * @description Tests for delete service functionality in ServiceDetailPage.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ServiceDetailPage from '@/modules/services-directory/pages/ServiceDetailPage'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'svc-1' }),
}))

const mockGetService = jest.fn()
const mockDeleteService = jest.fn()
const mockUploadServicePhoto = jest.fn()

const mockService = {
  id: 'svc-1',
  name: 'Clínica Pet',
  serviceTypeId: 'type-1',
  serviceType: { id: 'type-1', code: 'CLINIC', label: 'Clínica', color: 'bg-green-100 text-green-800', active: true, sortOrder: 1 },
  description: 'Clínica veterinária.',
  zipCode: null, street: null, number: null, complement: null,
  neighborhood: null, city: null, state: null,
  phone: null, whatsapp: null, email: null,
  website: null, instagram: null, facebook: null, tiktok: null, youtube: null,
  googleMapsUrl: null, googleBusinessUrl: null,
  organizationId: null,
  photoUrl: null,
  createdByUserId: 'user-1',
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

let mockServiceState: typeof mockService | null = null

jest.mock('@/modules/services-directory/hooks/useServicesDirectory', () => ({
  useServicesDirectory: () => ({
    service: mockServiceState,
    serviceTypes: [],
    isLoading: false,
    error: null,
    getService: mockGetService,
    createService: jest.fn(),
    updateService: jest.fn(),
    deleteService: mockDeleteService,
    listServiceTypes: jest.fn(),
    uploadServicePhoto: mockUploadServicePhoto,
    services: [],
    listServices: jest.fn(),
  }),
}))

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}))

let mockAuthUser: { id: string; email: string; name: string; personId: string | null } | null = null

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/servicos/svc-1']}>
      <Routes>
        <Route path="/servicos/:id" element={<ServiceDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ServiceDetailPage — delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockServiceState = mockService
    mockGetService.mockResolvedValue(undefined)
    mockDeleteService.mockResolvedValue(undefined)
  })

  it('shows delete button for the creator', () => {
    mockAuthUser = { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'p-1' }
    renderDetail()
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()
  })

  it('shows confirmation step when delete clicked', () => {
    mockAuthUser = { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'p-1' }
    renderDetail()
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
    expect(screen.getByRole('button', { name: /confirmar exclusão/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('calls deleteService and navigates to list on confirm', async () => {
    mockAuthUser = { id: 'user-1', email: 'a@b.com', name: 'A', personId: 'p-1' }
    renderDetail()
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirmar exclusão/i }))
    await waitFor(() => {
      expect(mockDeleteService).toHaveBeenCalledWith('svc-1')
      expect(mockNavigate).toHaveBeenCalledWith('/servicos')
    })
  })

  it('does NOT show delete button for non-creator', () => {
    mockAuthUser = { id: 'user-2', email: 'b@c.com', name: 'B', personId: 'p-2' }
    renderDetail()
    expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
  })

  it('does NOT show delete button for unauthenticated user', () => {
    mockAuthUser = null
    renderDetail()
    expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
  })
})
