/**
 * @module organization
 * @file OrganizationForm.test.tsx
 * @description Tests for the OrganizationForm component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OrganizationForm from '@/modules/organization/components/OrganizationForm'

const mockOnSubmit = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('OrganizationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('should render name and type fields', () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
  })

  it('should show CNPJ as required when COMPANY is selected', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'COMPANY')

    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(screen.getByText(/cnpj é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('should not require CNPJ when NGO is selected', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'NGO')
    await userEvent.type(screen.getByLabelText(/nome/i), 'Amigos dos Pets')

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'NGO', name: 'Amigos dos Pets' }),
      )
    })

    expect(screen.queryByText(/cnpj é obrigatório/i)).not.toBeInTheDocument()
  })

  it('should show inline error for invalid CNPJ', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'COMPANY')
    await userEvent.type(screen.getByLabelText(/cnpj/i), '11111111111111')
    await userEvent.tab()

    await waitFor(() => {
      expect(screen.getByText(/cnpj inválido/i)).toBeInTheDocument()
    })
  })

  it('should submit with valid COMPANY data', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Pet Care LTDA')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'COMPANY')
    await userEvent.type(screen.getByLabelText(/cnpj/i), '11222333000181')

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Pet Care LTDA',
          type: 'COMPANY',
          cnpj: '11222333000181',
        }),
      )
    })
  })

  it('should submit with valid NGO data without CNPJ', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Amigos dos Pets')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'NGO')

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Amigos dos Pets',
          type: 'NGO',
        }),
      )
    })
  })

  it('should show API error inline after failed submit', async () => {
    mockOnSubmit.mockRejectedValueOnce({ message: 'CNPJ já cadastrado.' })
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Pet Care LTDA')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'COMPANY')
    await userEvent.type(screen.getByLabelText(/cnpj/i), '11222333000181')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(screen.getByText('CNPJ já cadastrado.')).toBeInTheDocument()
    })
  })

  it('should pre-fill fields when initialData is provided', () => {
    const initialData = {
      name: 'Pet Care LTDA',
      type: 'COMPANY' as const,
      cnpj: '11222333000181',
    }
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} initialData={initialData} />)

    expect(screen.getByDisplayValue('Pet Care LTDA')).toBeInTheDocument()
    expect(screen.getByDisplayValue('11.222.333/0001-81')).toBeInTheDocument()
  })

  it('should render a photo file input', () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/foto/i)).toBeInTheDocument()
  })

  it('should show image preview when a file is selected', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    const file = new File(['img'], 'org.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText(/foto/i)

    await userEvent.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /preview/i })).toBeInTheDocument()
    })
  })

  it('should include photoFile in onSubmit data when file is selected', async () => {
    renderWithRouter(<OrganizationForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Amigos dos Pets')
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), 'NGO')

    const file = new File(['img'], 'org.jpg', { type: 'image/jpeg' })
    await userEvent.upload(screen.getByLabelText(/foto/i), file)

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ photoFile: file }),
      )
    })
  })
})
