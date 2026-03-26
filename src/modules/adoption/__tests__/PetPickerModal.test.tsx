/**
 * @module adoption
 * @file PetPickerModal.test.tsx
 * @description Tests for the PetPickerModal component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PetPickerModal from '@/modules/adoption/components/PetPickerModal'
import { usePet } from '@/modules/pet/hooks/usePet'
import type { Pet } from '@/modules/pet/types'

jest.mock('@/modules/pet/hooks/usePet')
const mockUsePet = usePet as jest.MockedFunction<typeof usePet>

const MOCK_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Rex',
    species: 'dog',
    breed: 'Labrador',
    gender: null,
    castrated: null,
    birthDate: null,
    photoUrl: null,
    primaryTutorId: 'person-1',
    primaryTutorshipType: 'OWNER',
    coTutorIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'pet-2',
    name: 'Mimi',
    species: 'cat',
    breed: null,
    gender: null,
    castrated: null,
    birthDate: null,
    photoUrl: null,
    primaryTutorId: 'person-1',
    primaryTutorshipType: 'OWNER',
    coTutorIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

const mockListPets = jest.fn()
const mockCreatePet = jest.fn()
const mockOnClose = jest.fn()
const mockOnSelect = jest.fn()

function makeUsePetReturn(overrides = {}) {
  return {
    pets: MOCK_PETS,
    pet: null,
    tutorshipHistory: [],
    isLoading: false,
    error: null,
    listPets: mockListPets,
    createPet: mockCreatePet,
    getPet: jest.fn(),
    updatePet: jest.fn(),
    transferTutorship: jest.fn(),
    getTutorshipHistory: jest.fn(),
    uploadPhoto: jest.fn(),
    ...overrides,
  }
}

function renderModal(isOpen = true) {
  mockUsePet.mockReturnValue(makeUsePetReturn())
  return render(
    <MemoryRouter>
      <PetPickerModal isOpen={isOpen} onClose={mockOnClose} onSelect={mockOnSelect} />
    </MemoryRouter>,
  )
}

describe('PetPickerModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListPets.mockResolvedValue(undefined)
    mockCreatePet.mockResolvedValue(MOCK_PETS[0])
  })

  it('does not render when isOpen is false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the modal with title when isOpen is true', () => {
    renderModal(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Selecionar pet')).toBeInTheDocument()
  })

  it('calls listPets when modal opens', async () => {
    renderModal(true)
    await waitFor(() => {
      expect(mockListPets).toHaveBeenCalledTimes(1)
    })
  })

  it('shows loading state while fetching pets', () => {
    mockUsePet.mockReturnValue(makeUsePetReturn({ isLoading: true, pets: [] }))
    render(
      <MemoryRouter>
        <PetPickerModal isOpen onClose={mockOnClose} onSelect={mockOnSelect} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders pet list with names and species', () => {
    renderModal(true)
    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Mimi')).toBeInTheDocument()
    expect(screen.getByText(/cão/i)).toBeInTheDocument()
    expect(screen.getByText(/gato/i)).toBeInTheDocument()
  })

  it('calls onSelect and onClose when a pet is clicked', async () => {
    renderModal(true)

    await userEvent.click(screen.getByRole('button', { name: /rex/i }))

    expect(mockOnSelect).toHaveBeenCalledWith(MOCK_PETS[0])
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows empty state message when no pets exist', () => {
    mockUsePet.mockReturnValue(makeUsePetReturn({ pets: [] }))
    render(
      <MemoryRouter>
        <PetPickerModal isOpen onClose={mockOnClose} onSelect={mockOnSelect} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/você ainda não tem pets cadastrados/i)).toBeInTheDocument()
  })

  it('shows "Cadastrar novo pet" button', () => {
    renderModal(true)
    expect(screen.getByRole('button', { name: /cadastrar novo pet/i })).toBeInTheDocument()
  })

  it('shows the pet form when "Cadastrar novo pet" is clicked', async () => {
    renderModal(true)

    await userEvent.click(screen.getByRole('button', { name: /cadastrar novo pet/i }))

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
  })

  it('hides the pet form when "Voltar" is clicked', async () => {
    renderModal(true)

    await userEvent.click(screen.getByRole('button', { name: /cadastrar novo pet/i }))
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
  })

  it('creates pet and calls onSelect when new pet form is submitted', async () => {
    const newPet = { ...MOCK_PETS[0], id: 'pet-new', name: 'Bolinha' }
    mockCreatePet.mockResolvedValueOnce(newPet)
    mockUsePet.mockReturnValue(makeUsePetReturn({ createPet: mockCreatePet }))

    render(
      <MemoryRouter>
        <PetPickerModal isOpen onClose={mockOnClose} onSelect={mockOnSelect} />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: /cadastrar novo pet/i }))

    await userEvent.type(screen.getByLabelText(/nome/i), 'Bolinha')
    await userEvent.selectOptions(screen.getByLabelText(/espécie/i), 'dog')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockCreatePet).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Bolinha', species: 'dog' }),
      )
      expect(mockOnSelect).toHaveBeenCalledWith(newPet)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})
