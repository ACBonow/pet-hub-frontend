/**
 * @module lost-found
 * @file LostFoundList.test.tsx
 * @description Tests for the LostFoundListPage component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LostFoundListPage from '@/modules/lost-found/pages/LostFoundListPage'

const mockListReports = jest.fn()

const mockReports = [
  {
    id: 'report-1',
    type: 'LOST' as const,
    status: 'OPEN' as const,
    petName: 'Rex',
    species: 'dog',
    description: 'Cachorro perdido no parque.',
    location: 'Parque Ibirapuera',
    photoUrl: null,
    contactEmail: 'joao@example.com',
    contactPhone: null,
    reportedById: 'person-1',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'report-2',
    type: 'FOUND' as const,
    status: 'OPEN' as const,
    petName: 'Gato encontrado',
    species: 'cat',
    description: 'Gato encontrado na rua.',
    location: 'Av. Paulista',
    photoUrl: null,
    contactEmail: 'maria@example.com',
    contactPhone: null,
    reportedById: 'person-2',
    createdAt: '2026-03-02T00:00:00.000Z',
    updatedAt: '2026-03-02T00:00:00.000Z',
  },
]

jest.mock('@/modules/lost-found/hooks/useLostFound', () => ({
  useLostFound: () => ({
    reports: mockReports,
    report: null,
    isLoading: false,
    error: null,
    listReports: mockListReports,
    getReport: jest.fn(),
    createReport: jest.fn(),
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('LostFoundListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListReports.mockResolvedValue(undefined)
  })

  it('should render reports with PERDIDO badge for LOST type', () => {
    renderWithRouter(<LostFoundListPage />)
    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getAllByText('Perdido').length).toBeGreaterThan(0)
  })

  it('should render reports with ACHADO badge for FOUND type', () => {
    renderWithRouter(<LostFoundListPage />)
    expect(screen.getByText('Gato encontrado')).toBeInTheDocument()
    expect(screen.getAllByText('Achado').length).toBeGreaterThan(0)
  })

  it('should call listReports on mount', async () => {
    renderWithRouter(<LostFoundListPage />)
    await waitFor(() => {
      expect(mockListReports).toHaveBeenCalledTimes(1)
    })
  })

  it('should filter by type when filter is changed', async () => {
    renderWithRouter(<LostFoundListPage />)

    const typeFilter = screen.getByLabelText(/tipo/i)
    await userEvent.selectOptions(typeFilter, 'LOST')

    await waitFor(() => {
      expect(mockListReports).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'LOST' }),
      )
    })
  })
})
