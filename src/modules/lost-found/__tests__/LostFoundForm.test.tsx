/**
 * @module lost-found
 * @file LostFoundForm.test.tsx
 * @description Tests for the LostFoundForm component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LostFoundForm from '@/modules/lost-found/components/LostFoundForm'

const mockOnSubmit = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('LostFoundForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('should render type, description, location and contact fields', () => {
    renderWithRouter(<LostFoundForm onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/localização/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email de contato/i)).toBeInTheDocument()
  })

  it('should require contact email', async () => {
    renderWithRouter(<LostFoundForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Cachorro perdido')
    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(screen.getByText(/email de contato é obrigatório/i)).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should submit report with type LOST', async () => {
    renderWithRouter(<LostFoundForm onSubmit={mockOnSubmit} />)

    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'LOST')
    await userEvent.type(screen.getByLabelText(/descrição/i), 'Cachorro perdido no parque.')
    await userEvent.type(screen.getByLabelText(/localização/i), 'Parque Ibirapuera')
    await userEvent.type(screen.getByLabelText(/email de contato/i), 'joao@example.com')

    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'LOST',
          description: 'Cachorro perdido no parque.',
          location: 'Parque Ibirapuera',
          contactEmail: 'joao@example.com',
        }),
      )
    })
  })

  it('should submit report with type FOUND', async () => {
    renderWithRouter(<LostFoundForm onSubmit={mockOnSubmit} />)

    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'FOUND')
    await userEvent.type(screen.getByLabelText(/email de contato/i), 'maria@example.com')
    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'FOUND', contactEmail: 'maria@example.com' }),
      )
    })
  })

  it('should show API error inline after failed submit', async () => {
    mockOnSubmit.mockRejectedValueOnce({ message: 'Erro ao criar relatório.' })
    renderWithRouter(<LostFoundForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/email de contato/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar relatório.')).toBeInTheDocument()
    })
  })
})
