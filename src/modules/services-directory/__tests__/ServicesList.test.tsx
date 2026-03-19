/**
 * @module services-directory
 * @file ServicesList.test.tsx
 * @description Tests for the ServicesListPage component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ServicesListPage from '@/modules/services-directory/pages/ServicesListPage'

const mockListServices = jest.fn()

const mockServices = [
  {
    id: 'svc-1',
    name: 'Clínica Pet Saúde',
    type: 'CLINIC' as const,
    description: 'Clínica veterinária completa.',
    address: 'Rua das Flores, 123',
    phone: '11999990001',
    email: 'contato@petsaude.com',
    website: null,
    organizationId: null,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'svc-2',
    name: 'Pet Banho e Tosa',
    type: 'GROOMING' as const,
    description: null,
    address: 'Av. Central, 456',
    phone: '11999990002',
    email: null,
    website: null,
    organizationId: null,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
]

jest.mock('@/modules/services-directory/hooks/useServicesDirectory', () => ({
  useServicesDirectory: () => ({
    services: mockServices,
    isLoading: false,
    error: null,
    listServices: mockListServices,
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ServicesListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListServices.mockResolvedValue(undefined)
  })

  it('should render service cards with name and type badge', () => {
    renderWithRouter(<ServicesListPage />)
    expect(screen.getByText('Clínica Pet Saúde')).toBeInTheDocument()
    expect(screen.getByText('Pet Banho e Tosa')).toBeInTheDocument()
    // Badge appears inside the card (may also appear in the filter <option>, so use getAllByText)
    expect(screen.getAllByText('Clínica').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Banho e Tosa').length).toBeGreaterThanOrEqual(1)
  })

  it('should call listServices on mount', async () => {
    renderWithRouter(<ServicesListPage />)
    await waitFor(() => {
      expect(mockListServices).toHaveBeenCalledTimes(1)
    })
  })

  it('should filter by type when filter is changed', async () => {
    renderWithRouter(<ServicesListPage />)

    const typeFilter = screen.getByLabelText(/tipo/i)
    await userEvent.selectOptions(typeFilter, 'CLINIC')

    await waitFor(() => {
      expect(mockListServices).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'CLINIC' }),
      )
    })
  })

  it('should search by name with debounce', async () => {
    renderWithRouter(<ServicesListPage />)

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await userEvent.type(searchInput, 'Pet')

    await waitFor(
      () => {
        expect(mockListServices).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Pet' }),
        )
      },
      { timeout: 1000 },
    )
  })

  it('should be accessible without authentication', () => {
    renderWithRouter(<ServicesListPage />)
    expect(screen.queryByText(/não autorizado/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/faça login/i)).not.toBeInTheDocument()
  })
})
