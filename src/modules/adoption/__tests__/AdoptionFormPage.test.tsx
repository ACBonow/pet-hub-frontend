/**
 * @module adoption
 * @file AdoptionFormPage.test.tsx
 * @description Tests for AdoptionFormPage — ActingAsSelector integration and organizationId in payload.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdoptionFormPage from '@/modules/adoption/pages/AdoptionFormPage'
import type { Pet } from '@/modules/pet/types'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const MOCK_PET: Pet = {
  id: 'pet-1',
  name: 'Rex',
  species: 'dog',
  breed: null,
  gender: null,
  castrated: null,
  birthDate: null,
  photoUrl: null,
  primaryTutorId: 'person-1',
  primaryTutorshipType: 'OWNER',
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const mockCreateAdoption = jest.fn()
jest.mock('@/modules/adoption/hooks/useAdoption', () => ({
  useAdoption: () => ({
    isLoading: false,
    createAdoption: mockCreateAdoption,
    adoptionListings: [],
    getAdoptionListings: jest.fn(),
  }),
}))

jest.mock('@/modules/adoption/components/PetPickerModal', () => ({
  default: ({ isOpen, onSelect }: { isOpen: boolean; onSelect: (pet: Pet) => void }) =>
    isOpen ? (
      <div>
        <button onClick={() => onSelect(MOCK_PET)}>Selecionar Rex</button>
      </div>
    ) : null,
}))

const mockSetContext = jest.fn()
let mockContext: import('@/shared/hooks/useActingAs').ActingAsContext = { type: 'person' }
let mockAvailableOrgs: { id: string; name: string }[] = []

jest.mock('@/shared/hooks/useActingAs', () => ({
  useActingAs: () => ({
    context: mockContext,
    availableOrgs: mockAvailableOrgs,
    setContext: mockSetContext,
  }),
}))

// Stub ActingAsSelector so it renders a real select for org
jest.mock('@/shared/components/ui/ActingAsSelector', () => ({
  default: () => {
    const { useActingAs } = jest.requireMock('@/shared/hooks/useActingAs')
    const { availableOrgs, setContext } = useActingAs()
    if (availableOrgs.length === 0) return null
    return (
      <select
        aria-label="Criar como"
        onChange={(e) => {
          if (!e.target.value) setContext({ type: 'person' })
          else setContext({ type: 'org', organizationId: e.target.value })
        }}
      >
        <option value="">Eu (pessoal)</option>
        {availableOrgs.map((o: { id: string; name: string }) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    )
  },
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <AdoptionFormPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  mockContext = { type: 'person' } as import('@/shared/hooks/useActingAs').ActingAsContext
  mockAvailableOrgs = []
  mockCreateAdoption.mockResolvedValue(undefined)
})

describe('AdoptionFormPage', () => {
  it('does not show org selector when user has no eligible orgs', () => {
    mockAvailableOrgs = []
    renderPage()
    expect(screen.queryByLabelText(/criar como/i)).not.toBeInTheDocument()
  })

  it('shows org selector when user has OWNER/MANAGER orgs', () => {
    mockAvailableOrgs = [{ id: 'org-1', name: 'ONG Pet Rescue' }]
    renderPage()
    expect(screen.getByLabelText(/criar como/i)).toBeInTheDocument()
    expect(screen.getByText('ONG Pet Rescue')).toBeInTheDocument()
  })

  it('includes organizationId in payload when org is selected', async () => {
    mockAvailableOrgs = [{ id: 'org-1', name: 'ONG Pet Rescue' }]
    mockContext = { type: 'org', organizationId: 'org-1' }
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))
    await userEvent.click(screen.getByRole('button', { name: /publicar anúncio/i }))

    await waitFor(() => {
      expect(mockCreateAdoption).toHaveBeenCalledWith(
        expect.objectContaining({ organizationId: 'org-1' }),
      )
    })
  })

  it('sends null organizationId when "Eu (pessoal)" is selected', async () => {
    mockAvailableOrgs = [{ id: 'org-1', name: 'ONG Pet Rescue' }]
    mockContext = { type: 'person' }
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))
    await userEvent.click(screen.getByRole('button', { name: /publicar anúncio/i }))

    await waitFor(() => {
      expect(mockCreateAdoption).toHaveBeenCalledWith(
        expect.objectContaining({ organizationId: null }),
      )
    })
  })
})
