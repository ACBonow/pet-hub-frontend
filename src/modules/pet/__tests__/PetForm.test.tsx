/**
 * @module pet
 * @file PetForm.test.tsx
 * @description Tests for the PetForm component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PetForm from '@/modules/pet/components/PetForm'

const mockOnSubmit = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('PetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('should render name, species, breed, and birth date fields', () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/espécie/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/raça/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
  })

  it('should submit valid pet data without tutor ID field', async () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Rex')
    await userEvent.selectOptions(screen.getByLabelText(/espécie/i), 'dog')
    await userEvent.type(screen.getByLabelText(/raça/i), 'Labrador')

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Rex', species: 'dog', breed: 'Labrador' }),
      )
    })
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.not.objectContaining({ primaryTutorId: expect.anything() }),
    )
  })

  it('should require name before submitting', async () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show API error inline after failed submit', async () => {
    mockOnSubmit.mockRejectedValueOnce({ message: 'Perfil de pessoa não encontrado.' })
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Rex')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(screen.getByText('Perfil de pessoa não encontrado.')).toBeInTheDocument()
    })
  })

  it('should pre-fill fields when initialData is provided', () => {
    const initialData = { name: 'Rex', species: 'dog', breed: 'Labrador' }
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} initialData={initialData} />)

    expect(screen.getByDisplayValue('Rex')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Labrador')).toBeInTheDocument()
  })

  it('should render the photo upload field', () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/foto do pet/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /adicionar foto/i })).toBeInTheDocument()
  })

  it('should show photo preview when a file is selected', async () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)

    const file = new File(['fake-jpeg'], 'photo.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/foto do pet/i)
    await userEvent.upload(fileInput, file)

    expect(screen.getByAltText(/prévia da foto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /alterar foto/i })).toBeInTheDocument()
  })

  it('should pass photoFile to onSubmit when file is selected', async () => {
    renderWithRouter(<PetForm onSubmit={mockOnSubmit} />)

    const file = new File(['fake-jpeg'], 'photo.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/foto do pet/i)
    await userEvent.upload(fileInput, file)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Rex')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ photoFile: file }),
      )
    })
  })

  it('should show existing photo when photoUrl is in initialData', () => {
    renderWithRouter(
      <PetForm onSubmit={mockOnSubmit} initialData={{ photoUrl: 'https://example.com/photo.jpg' }} />,
    )
    const img = screen.getByAltText(/prévia da foto/i)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })
})
