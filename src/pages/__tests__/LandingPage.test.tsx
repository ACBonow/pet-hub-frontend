/**
 * @file LandingPage.test.tsx
 * @description Tests for the public landing page with three carousels.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(() => ({ isAuthenticated: false, user: null })),
}))

jest.mock('@/modules/adoption/services/adoption.service')
jest.mock('@/modules/lost-found/services/lostFound.service')
jest.mock('@/modules/services-directory/services/servicesDirectory.service')

import { listAdoptionsRequest } from '@/modules/adoption/services/adoption.service'
import { listReportsRequest } from '@/modules/lost-found/services/lostFound.service'
import { listServicesRequest } from '@/modules/services-directory/services/servicesDirectory.service'

const mockListAdoptions = listAdoptionsRequest as jest.MockedFunction<typeof listAdoptionsRequest>
const mockListReports = listReportsRequest as jest.MockedFunction<typeof listReportsRequest>
const mockListServices = listServicesRequest as jest.MockedFunction<typeof listServicesRequest>

const mockAdoptions = [
  {
    id: '1', petId: 'p1', petName: 'Rex', species: 'dog', breed: null,
    photoUrl: null, gender: null, castrated: null,
    description: 'Cãozinho amigável', status: 'AVAILABLE' as const,
    contactEmail: null, contactPhone: null, contactWhatsapp: null, personId: null, organizationId: null,
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
]

const mockReports = [
  {
    id: '1', type: 'LOST' as const, status: 'OPEN' as const, petName: 'Bolinha',
    species: 'cat', description: 'Gato perdido no centro', location: 'Centro', photoUrl: null,
    addressStreet: null, addressNeighborhood: null, addressNumber: null,
    addressCep: null, addressCity: null, addressState: null, addressNotes: null,
    contactEmail: 'a@b.com', contactPhone: null, reporterId: 'u1',
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
]

const mockServices = {
  data: [
    {
      id: '1', name: 'Clínica Vet',
      serviceTypeId: 'type-2',
      serviceType: { id: 'type-2', code: 'CLINIC', label: 'Clínica', color: 'bg-green-100 text-green-800', active: true, sortOrder: 2 },
      description: null,
      zipCode: null, street: null, number: null, complement: null,
      neighborhood: null, city: null, state: null,
      phone: null, whatsapp: null, email: null, website: null,
      instagram: null, facebook: null, tiktok: null, youtube: null,
      googleMapsUrl: null, googleBusinessUrl: null,
      organizationId: null, photoUrl: null, createdByUserId: null,
      createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
  ],
  total: 1, page: 1, pageSize: 6,
}

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('LandingPage', () => {
  beforeEach(() => {
    mockListAdoptions.mockResolvedValue(mockAdoptions)
    mockListReports.mockResolvedValue(mockReports)
    mockListServices.mockResolvedValue(mockServices)
  })

  afterEach(() => jest.clearAllMocks())

  it('should render the three section headings', async () => {
    renderWithRouter(<LandingPage />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /adoção/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /achados e perdidos/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /serviços/i })).toBeInTheDocument()
    })
  })

  it('should render "Ver todos" link for each section', async () => {
    renderWithRouter(<LandingPage />)
    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: /ver todos/i })).toHaveLength(3)
    })
  })

  it('should link "Ver todos" to correct routes', async () => {
    renderWithRouter(<LandingPage />)
    const links = await screen.findAllByRole('link', { name: /ver todos/i })
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/adocao')
    expect(hrefs).toContain('/achados-perdidos')
    expect(hrefs).toContain('/servicos')
  })

  it('should render adoption card after data loads', async () => {
    renderWithRouter(<LandingPage />)
    expect(await screen.findByText('Rex')).toBeInTheDocument()
  })

  it('should render lost-found card after data loads', async () => {
    renderWithRouter(<LandingPage />)
    expect(await screen.findByText('Bolinha')).toBeInTheDocument()
  })

  it('should render service card after data loads', async () => {
    renderWithRouter(<LandingPage />)
    expect(await screen.findByText('Clínica Vet')).toBeInTheDocument()
  })

  it('should call services with correct filters on mount', async () => {
    renderWithRouter(<LandingPage />)
    await waitFor(() => {
      expect(mockListAdoptions).toHaveBeenCalledWith({ status: 'AVAILABLE' })
      expect(mockListReports).toHaveBeenCalledWith({ status: 'OPEN' })
      expect(mockListServices).toHaveBeenCalledWith({ pageSize: 6 })
    })
  })

  it('should still render sections when API calls fail', async () => {
    mockListAdoptions.mockRejectedValue(new Error('Network error'))
    mockListReports.mockRejectedValue(new Error('Network error'))
    mockListServices.mockRejectedValue(new Error('Network error'))
    renderWithRouter(<LandingPage />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /adoção/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /achados e perdidos/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /serviços/i })).toBeInTheDocument()
    })
  })
})
