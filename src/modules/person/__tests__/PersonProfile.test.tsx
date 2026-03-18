/**
 * @module person
 * @file PersonProfile.test.tsx
 * @description Tests for the PersonProfile component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PersonProfile from '@/modules/person/components/PersonProfile'

const mockGetPerson = jest.fn()
const mockUpdatePerson = jest.fn()

const mockPerson = {
  id: 'person-1',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '52998224725',
  phone: null,
  createdAt: '2026-03-01T00:00:00.000Z',
  updatedAt: '2026-03-01T00:00:00.000Z',
}

jest.mock('@/modules/person/hooks/usePerson', () => ({
  usePerson: () => ({
    person: mockPerson,
    isLoading: false,
    error: null,
    getPerson: mockGetPerson,
    updatePerson: mockUpdatePerson,
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('PersonProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetPerson.mockResolvedValue(undefined)
    mockUpdatePerson.mockResolvedValue(undefined)
  })

  it('should display person name', () => {
    renderWithRouter(<PersonProfile personId="person-1" />)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('should display CPF formatted', () => {
    renderWithRouter(<PersonProfile personId="person-1" />)
    expect(screen.getByText(/529\.982\.247-25/)).toBeInTheDocument()
  })

  it('should have CPF field as read-only', () => {
    renderWithRouter(<PersonProfile personId="person-1" />)
    const cpfField = screen.getByDisplayValue('529.982.247-25')
    expect(cpfField).toHaveAttribute('readonly')
  })

  it('should call updatePerson on save with changed name', async () => {
    renderWithRouter(<PersonProfile personId="person-1" />)

    const nameInput = screen.getByDisplayValue('João Silva')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'João da Silva')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(mockUpdatePerson).toHaveBeenCalledWith('person-1', expect.objectContaining({
        name: 'João da Silva',
      }))
    })
  })

  it('should display success message after save', async () => {
    renderWithRouter(<PersonProfile personId="person-1" />)

    const nameInput = screen.getByDisplayValue('João Silva')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'João da Silva')
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByText(/salvo com sucesso/i)).toBeInTheDocument()
  })
})
