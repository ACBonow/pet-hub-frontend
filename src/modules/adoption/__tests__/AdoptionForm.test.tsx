/**
 * @module adoption
 * @file AdoptionForm.test.tsx
 * @description Tests for the AdoptionForm component with pet picker integration.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdoptionForm from '@/modules/adoption/components/AdoptionForm'
import type { Pet } from '@/modules/pet/types'

const MOCK_PET: Pet = {
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
  coTutors: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

// Isolate AdoptionForm from PetPickerModal internals — modal is tested separately
jest.mock('@/modules/adoption/components/PetPickerModal', () => ({
  default: ({ isOpen, onSelect, onClose }: {
    isOpen: boolean
    onSelect: (pet: Pet) => void
    onClose: () => void
  }) =>
    isOpen ? (
      <div role="dialog" aria-label="Selecionar pet">
        <button onClick={() => onSelect(MOCK_PET)}>Selecionar Rex</button>
        <button onClick={onClose}>Fechar modal</button>
      </div>
    ) : null,
}))

const mockOnSubmit = jest.fn()

function renderForm() {
  return render(
    <MemoryRouter>
      <AdoptionForm onSubmit={mockOnSubmit} isLoading={false} />
    </MemoryRouter>,
  )
}

describe('AdoptionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('renders "Selecionar pet" button initially', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /selecionar pet/i })).toBeInTheDocument()
  })

  it('opens the pet picker modal when "Selecionar pet" is clicked', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))

    expect(screen.getByRole('dialog', { name: /selecionar pet/i })).toBeInTheDocument()
  })

  it('closes the modal when onClose is triggered', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows selected pet name and species after selection', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText(/cão/i)).toBeInTheDocument()
  })

  it('shows "Trocar pet" button after selection', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))

    expect(screen.getByRole('button', { name: /trocar pet/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /selecionar pet/i })).not.toBeInTheDocument()
  })

  it('reopens modal when "Trocar pet" is clicked', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))
    await userEvent.click(screen.getByRole('button', { name: /trocar pet/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows validation error when submitted without selecting a pet', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /publicar anúncio/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/selecione um pet/i)
  })

  it('renders WhatsApp field', () => {
    renderForm()
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument()
  })

  it('calls onSubmit with petId, description, and contactWhatsapp', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Cachorro dócil')
    await userEvent.type(screen.getByLabelText(/whatsapp/i), '51999999999')
    await userEvent.click(screen.getByRole('button', { name: /publicar anúncio/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          petId: 'pet-1',
          description: 'Cachorro dócil',
          contactWhatsapp: '51999999999',
        }),
      )
    })
  })

  it('calls onSubmit with petId when pet is selected and form is submitted', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: /selecionar pet/i }))
    await userEvent.click(screen.getByRole('button', { name: /selecionar rex/i }))

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Cachorro dócil')
    await userEvent.click(screen.getByRole('button', { name: /publicar anúncio/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          petId: 'pet-1',
          description: 'Cachorro dócil',
        }),
      )
    })
  })

  it('does not call onSubmit when isLoading is true', async () => {
    render(
      <MemoryRouter>
        <AdoptionForm onSubmit={mockOnSubmit} isLoading />
      </MemoryRouter>,
    )

    const submitButton = screen.getByRole('button', { name: /publicar anúncio/i })
    expect(submitButton).toBeDisabled()
  })
})
