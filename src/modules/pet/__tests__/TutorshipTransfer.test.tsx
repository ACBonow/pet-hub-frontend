/**
 * @module pet
 * @file TutorshipTransfer.test.tsx
 * @description Tests for the TutorshipTransfer component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TutorshipTransfer from '@/modules/pet/components/TutorshipTransfer'

const mockOnTransfer = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('TutorshipTransfer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnTransfer.mockResolvedValue(undefined)
  })

  it('should render transfer button', () => {
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)
    expect(screen.getByRole('button', { name: /transferir tutoria/i })).toBeInTheDocument()
  })

  it('should show confirmation modal when transfer button is clicked', async () => {
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)

    await userEvent.click(screen.getByRole('button', { name: /transferir tutoria/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/confirmar transferência/i)).toBeInTheDocument()
  })

  it('should close modal without calling onTransfer when cancelled', async () => {
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)

    await userEvent.click(screen.getByRole('button', { name: /transferir tutoria/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnTransfer).not.toHaveBeenCalled()
  })

  it('should call onTransfer with CPF when confirmed', async () => {
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)

    await userEvent.click(screen.getByRole('button', { name: /transferir tutoria/i }))

    await userEvent.type(screen.getByLabelText(/cpf do novo tutor/i), '52998224725')
    await userEvent.selectOptions(screen.getByLabelText(/tipo de tutoria/i), 'TUTOR')

    await userEvent.click(screen.getByRole('button', { name: /^confirmar$/i }))

    await waitFor(() => {
      expect(mockOnTransfer).toHaveBeenCalledWith({
        newTutorCpf: '52998224725',
        tutorshipType: 'TUTOR',
      })
    })
  })

  it('should close modal after successful transfer', async () => {
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)

    await userEvent.click(screen.getByRole('button', { name: /transferir tutoria/i }))
    await userEvent.type(screen.getByLabelText(/cpf do novo tutor/i), '52998224725')
    await userEvent.click(screen.getByRole('button', { name: /^confirmar$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should show error in modal when transfer fails', async () => {
    mockOnTransfer.mockRejectedValueOnce({ message: 'Tutor não encontrado.' })
    renderWithRouter(<TutorshipTransfer petId="pet-1" onTransfer={mockOnTransfer} />)

    await userEvent.click(screen.getByRole('button', { name: /transferir tutoria/i }))
    await userEvent.type(screen.getByLabelText(/cpf do novo tutor/i), '52998224725')
    await userEvent.click(screen.getByRole('button', { name: /^confirmar$/i }))

    await waitFor(() => {
      expect(screen.getByText('Tutor não encontrado.')).toBeInTheDocument()
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
