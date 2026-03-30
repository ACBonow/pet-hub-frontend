/**
 * @module services-directory
 * @file ServiceForm.test.tsx
 * @description Tests for ServiceForm photo upload feature and ServiceCard photo display.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ServiceForm from '@/modules/services-directory/components/ServiceForm'
import ServiceCard from '@/modules/services-directory/components/ServiceCard'
import type { ServiceListing, ServiceTypeRecord } from '@/modules/services-directory/types'

const mockServiceTypes: ServiceTypeRecord[] = [
  { id: 'type-1', code: 'CLINIC', label: 'Clínica', color: 'bg-green-100 text-green-800', active: true, sortOrder: 1 },
]

const mockService: ServiceListing = {
  id: 'svc-1',
  name: 'Clínica Pet Saúde',
  serviceTypeId: 'type-1',
  serviceType: mockServiceTypes[0],
  description: 'Clínica veterinária completa.',
  zipCode: null,
  street: null,
  number: null,
  complement: null,
  neighborhood: null,
  city: null,
  state: null,
  phone: null,
  whatsapp: null,
  email: null,
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

// Mock URL.createObjectURL
beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'blob:mock-preview-url'),
  })
})

describe('ServiceForm — photo upload', () => {
  it('should render photo input in the form', () => {
    const mockSubmit = jest.fn()
    render(<ServiceForm onSubmit={mockSubmit} isLoading={false} serviceTypes={mockServiceTypes} />)

    // Should have a button to add photo
    expect(screen.getByText(/adicionar foto/i)).toBeInTheDocument()
  })

  it('should show preview when a file is selected', async () => {
    const mockSubmit = jest.fn()
    render(<ServiceForm onSubmit={mockSubmit} isLoading={false} serviceTypes={mockServiceTypes} />)

    const file = new File(['fake-image'], 'photo.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/foto do serviço/i)

    await userEvent.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByAltText(/prévia/i)).toBeInTheDocument()
    })
  })

  it('should call onSubmit with photoFile when file is selected and form is submitted', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined)
    render(<ServiceForm onSubmit={mockSubmit} isLoading={false} serviceTypes={mockServiceTypes} />)

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/nome/i), 'Clínica Teste')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'CLINIC')

    // Upload file
    const file = new File(['fake-image'], 'photo.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/foto do serviço/i)
    await userEvent.upload(fileInput, file)

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /cadastrar serviço/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ photoFile: expect.any(File) }),
      )
    })
  })
})

describe('ServiceCard — photo display', () => {
  const renderCard = (service: ServiceListing) =>
    render(
      <MemoryRouter>
        <ServiceCard service={service} />
      </MemoryRouter>,
    )

  it('should display image when photoUrl is present', () => {
    const serviceWithPhoto = { ...mockService, photoUrl: 'https://example.com/photo.jpg' }
    renderCard(serviceWithPhoto)

    const img = screen.getByRole('img', { name: mockService.name })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('should display placeholder when photoUrl is null', () => {
    renderCard({ ...mockService, photoUrl: null })

    // Should not have an img element
    expect(screen.queryByRole('img', { name: mockService.name })).not.toBeInTheDocument()
    // Should have the service name text
    expect(screen.getByText(mockService.name)).toBeInTheDocument()
  })
})
