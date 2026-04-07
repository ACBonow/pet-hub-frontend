/**
 * @module adoption
 * @file AdoptionList.test.tsx
 * @description Tests for the AdoptionListPage component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdoptionListPage from '@/modules/adoption/pages/AdoptionListPage'

const mockListAdoptions = jest.fn()

const mockListings = [
  {
    id: 'adoption-1',
    petId: 'pet-1',
    petName: 'Rex',
    species: 'dog',
    breed: 'Labrador',
    photoUrl: null,
    gender: 'male',
    castrated: false,
    description: 'Cachorro dócil e carinhoso.',
    status: 'AVAILABLE' as const,
    contactEmail: 'contato@petcare.com',
    contactPhone: null,
    contactWhatsapp: null,
    personId: null,
    organizationId: null,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'adoption-2',
    petId: 'pet-2',
    petName: 'Mimi',
    species: 'cat',
    breed: 'Siamês',
    photoUrl: null,
    gender: 'female',
    castrated: true,
    description: 'Gata muito carinhosa.',
    status: 'AVAILABLE' as const,
    contactEmail: 'contato@petcare.com',
    contactPhone: null,
    contactWhatsapp: null,
    personId: null,
    organizationId: null,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
]

jest.mock('@/modules/adoption/hooks/useAdoption', () => ({
  useAdoption: () => ({
    listings: mockListings,
    listing: null,
    isLoading: false,
    error: null,
    listAdoptions: mockListAdoptions,
    getAdoption: jest.fn(),
    createAdoption: jest.fn(),
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('AdoptionListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListAdoptions.mockResolvedValue(undefined)
  })

  it('should render adoption cards', () => {
    renderWithRouter(<AdoptionListPage />)
    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Mimi')).toBeInTheDocument()
  })

  it('should call listAdoptions on mount', async () => {
    renderWithRouter(<AdoptionListPage />)
    await waitFor(() => {
      expect(mockListAdoptions).toHaveBeenCalledTimes(1)
    })
  })

  it('should filter by species when filter is changed', async () => {
    renderWithRouter(<AdoptionListPage />)

    const speciesFilter = screen.getByLabelText(/espécie/i)
    await userEvent.selectOptions(speciesFilter, 'dog')

    await waitFor(() => {
      expect(mockListAdoptions).toHaveBeenCalledWith(
        expect.objectContaining({ species: 'dog' }),
      )
    })
  })

  it('should be accessible without showing auth error', () => {
    renderWithRouter(<AdoptionListPage />)
    expect(screen.queryByText(/não autorizado/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/faça login/i)).not.toBeInTheDocument()
  })
})
