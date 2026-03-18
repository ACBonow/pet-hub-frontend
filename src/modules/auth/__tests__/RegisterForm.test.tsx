/**
 * @module auth
 * @file RegisterForm.test.tsx
 * @description Tests for the RegisterForm component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterForm from '@/modules/auth/components/RegisterForm'

const mockRegister = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    isAuthenticated: false,
    isLoading: false,
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRegister.mockResolvedValue(undefined)
  })

  it('should display name, email, password, and CPF fields', () => {
    renderWithRouter(<RegisterForm />)

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByLabelText('CPF')).toBeInTheDocument()
  })

  it('should display a submit button', () => {
    renderWithRouter(<RegisterForm />)
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
  })

  it('should show inline error for invalid CPF', async () => {
    renderWithRouter(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('CPF'), '11111111111')
    await userEvent.tab()

    expect(await screen.findByText('CPF inválido')).toBeInTheDocument()
  })

  it('should show validation error for short name', async () => {
    renderWithRouter(<RegisterForm />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'A')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByText(/nome deve ter pelo menos/i)).toBeInTheDocument()
  })

  it('should call useAuth().register with form data on valid submit', async () => {
    renderWithRouter(<RegisterForm />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'João Silva')
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'senhasegura123')
    await userEvent.type(screen.getByLabelText('CPF'), '52998224725')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senhasegura123',
        cpf: '52998224725',
      })
    })
  })

  it('should display API error message when register fails', async () => {
    mockRegister.mockRejectedValueOnce({
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Este e-mail já está em uso.',
    })

    renderWithRouter(<RegisterForm />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'João Silva')
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'senhasegura123')
    await userEvent.type(screen.getByLabelText('CPF'), '52998224725')
    await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByText('Este e-mail já está em uso.')).toBeInTheDocument()
  })

  it('should have a link to the login page', () => {
    renderWithRouter(<RegisterForm />)
    expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument()
  })
})
