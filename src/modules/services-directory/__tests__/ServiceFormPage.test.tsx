/**
 * @module services-directory
 * @file ServiceFormPage.test.tsx
 * @description Tests for ServiceFormPage — create mode and edit mode.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ServiceFormPage from '@/modules/services-directory/pages/ServiceFormPage'
import ServiceDetailPage from '@/modules/services-directory/pages/ServiceDetailPage'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}))

let mockParams: { id?: string } = {}

const mockGetService = jest.fn()
const mockCreateService = jest.fn()
const mockUpdateService = jest.fn()
const mockListServiceTypes = jest.fn()
const mockUploadServicePhoto = jest.fn()

const mockServiceTypes = [
  { id: 'type-1', code: 'CLINIC', label: 'Clínica', color: 'bg-green-100 text-green-800', active: true, sortOrder: 1 },
]

const mockService = {
  id: 'svc-1',
  name: 'Clínica Pet Saúde',
  serviceTypeId: 'type-1',
  serviceType: mockServiceTypes[0],
  description: 'Clínica veterinária completa.',
  zipCode: null,
  street: 'Rua das Flores',
  number: '42',
  complement: null,
  neighborhood: null,
  city: 'São Paulo',
  state: 'SP',
  phone: '11999990000',
  whatsapp: null,
  email: 'contato@clinic.com',
  website: null,
  instagram: null,
  facebook: null,
  tiktok: null,
  youtube: null,
  googleMapsUrl: null,
  googleBusinessUrl: null,
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
    serviceTypes: mockServiceTypes,
    isLoading: false,
    error: null,
    getService: mockGetService,
    createService: mockCreateService,
    updateService: mockUpdateService,
    listServiceTypes: mockListServiceTypes,
    uploadServicePhoto: mockUploadServicePhoto,
    services: [],
    listServices: jest.fn(),
    deleteService: jest.fn(),
  }),
}))

jest.mock('@/shared/hooks/useActingAs', () => ({
  useActingAs: () => ({ context: { type: 'person' }, availableOrgs: [], setContext: jest.fn() }),
}))

jest.mock('@/shared/components/ui/ActingAsSelector', () => ({
  default: () => null,
}))

jest.mock('@/shared/utils/image', () => ({
  compressImage: jest.fn(async (f: File) => f),
}))

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockAuthUser }),
}))

let mockAuthUser: { id: string; email: string; name: string; personId: string | null } | null = null

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ServiceFormPage — create mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = {}
    mockServiceState = null
    mockAuthUser = null
    mockListServiceTypes.mockResolvedValue(undefined)
    mockCreateService.mockResolvedValue(mockService)
  })

  it('should render create form with submit button', () => {
    renderWithRouter(<ServiceFormPage />)
    expect(screen.getByRole('button', { name: /cadastrar serviço/i })).toBeInTheDocument()
  })

  it('should call createService on submit and navigate to detail', async () => {
    renderWithRouter(<ServiceFormPage />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Novo Serviço')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'CLINIC')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar serviço/i }))

    await waitFor(() => {
      expect(mockCreateService).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/servicos/svc-1')
    })
  })
})

describe('ServiceFormPage — edit mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'svc-1' }
    mockServiceState = mockService
    mockAuthUser = null
    mockListServiceTypes.mockResolvedValue(undefined)
    mockUpdateService.mockResolvedValue(mockService)
    mockGetService.mockResolvedValue(mockService)
  })

  it('should call getService on mount when id is present', () => {
    renderWithRouter(<ServiceFormPage />)
    expect(mockGetService).toHaveBeenCalledWith('svc-1')
  })

  it('should populate form fields with existing service data', () => {
    renderWithRouter(<ServiceFormPage />)
    expect(screen.getByDisplayValue('Clínica Pet Saúde')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
  })

  it('should call updateService with id on submit', async () => {
    renderWithRouter(<ServiceFormPage />)

    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => {
      expect(mockUpdateService).toHaveBeenCalledWith('svc-1', expect.any(Object))
      expect(mockCreateService).not.toHaveBeenCalled()
    })
  })

  it('should navigate to detail page after saving', async () => {
    renderWithRouter(<ServiceFormPage />)
    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/servicos/svc-1')
    })
  })
})

describe('ServiceDetailPage — Editar button', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { id: 'svc-1' }
    mockServiceState = mockService
    mockGetService.mockResolvedValue(mockService)
  })

  it('should show Editar button when user is the creator', () => {
    mockAuthUser = { id: 'user-1', email: 'a@a.com', name: 'Ana', personId: 'p-1' }
    renderWithRouter(<ServiceDetailPage />)
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('should NOT show Editar button for non-creator user', () => {
    mockAuthUser = { id: 'user-2', email: 'b@b.com', name: 'Bia', personId: 'p-2' }
    renderWithRouter(<ServiceDetailPage />)
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('should NOT show Editar button for unauthenticated user', () => {
    mockAuthUser = null
    renderWithRouter(<ServiceDetailPage />)
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })
})
