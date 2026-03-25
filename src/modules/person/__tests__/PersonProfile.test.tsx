/**
 * @module person
 * @file PersonProfile.test.tsx
 * @description Tests for the PersonProfile component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PersonProfile from '@/modules/person/components/PersonProfile'

const mockGetMe = jest.fn()
const mockCreatePerson = jest.fn()
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

const mockUsePerson = jest.fn()
jest.mock('@/modules/person/hooks/usePerson', () => ({
  usePerson: (...args: unknown[]) => mockUsePerson(...args),
}))

const renderComponent = () => render(<MemoryRouter><PersonProfile /></MemoryRouter>)

describe('PersonProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetMe.mockResolvedValue(undefined)
    mockCreatePerson.mockResolvedValue(undefined)
    mockUpdatePerson.mockResolvedValue(undefined)
  })

  describe('when person profile exists', () => {
    beforeEach(() => {
      mockUsePerson.mockReturnValue({
        person: mockPerson,
        isLoading: false,
        error: null,
        getMe: mockGetMe,
        createPerson: mockCreatePerson,
        updatePerson: mockUpdatePerson,
      })
    })

    it('should display person name', () => {
      renderComponent()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('should display CPF formatted', () => {
      renderComponent()
      expect(screen.getByText(/529\.982\.247-25/)).toBeInTheDocument()
    })

    it('should have CPF field as read-only', () => {
      renderComponent()
      const cpfField = screen.getByDisplayValue('529.982.247-25')
      expect(cpfField).toHaveAttribute('readonly')
    })

    it('should call updatePerson on save with changed name', async () => {
      renderComponent()

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
      renderComponent()

      const nameInput = screen.getByDisplayValue('João Silva')
      await userEvent.clear(nameInput)
      await userEvent.type(nameInput, 'João da Silva')
      await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

      expect(await screen.findByText(/salvo com sucesso/i)).toBeInTheDocument()
    })
  })

  describe('when no person profile (new user)', () => {
    beforeEach(() => {
      mockUsePerson.mockReturnValue({
        person: null,
        isLoading: false,
        error: null,
        getMe: mockGetMe,
        createPerson: mockCreatePerson,
        updatePerson: mockUpdatePerson,
      })
    })

    it('should show profile creation form', () => {
      renderComponent()
      expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
    })

    it('should call createPerson with form data when submitted', async () => {
      renderComponent()

      await userEvent.type(screen.getByLabelText(/nome/i), 'Arthur')
      await userEvent.type(screen.getByLabelText(/cpf/i), '52998224725')
      await userEvent.click(screen.getByRole('button', { name: /completar perfil/i }))

      await waitFor(() => {
        expect(mockCreatePerson).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Arthur', cpf: '52998224725' }),
        )
      })
    })

    it('should not call createPerson when name is empty', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button', { name: /completar perfil/i }))

      await waitFor(() => {
        expect(mockCreatePerson).not.toHaveBeenCalled()
      })
    })
  })

  describe('when loading', () => {
    it('should show loading state', () => {
      mockUsePerson.mockReturnValue({
        person: null,
        isLoading: true,
        error: null,
        getMe: mockGetMe,
        createPerson: mockCreatePerson,
        updatePerson: mockUpdatePerson,
      })

      renderComponent()
      expect(screen.getByText(/carregando/i)).toBeInTheDocument()
    })
  })
})
