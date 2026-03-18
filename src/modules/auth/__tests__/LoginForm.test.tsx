/**
 * @module auth
 * @file LoginForm.test.tsx
 * @description Tests for the LoginForm component.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '@/modules/auth/components/LoginForm'

const mockLogin = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
  }),
}))

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogin.mockResolvedValue(undefined)
  })

  it('should display email and password fields', () => {
    renderWithRouter(<LoginForm />)

    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('should display a submit button', () => {
    renderWithRouter(<LoginForm />)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    renderWithRouter(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/e-?mail inválido/i)).toBeInTheDocument()
  })

  it('should show validation error when password is empty', async () => {
    renderWithRouter(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/senha é obrigatória/i)).toBeInTheDocument()
  })

  it('should call useAuth().login with form data on valid submit', async () => {
    renderWithRouter(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'minhasenha123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'joao@example.com',
        password: 'minhasenha123',
      })
    })
  })

  it('should display API error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce({
      code: 'INVALID_CREDENTIALS',
      message: 'Email ou senha incorretos.',
    })

    renderWithRouter(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'senhaerrada')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('Email ou senha incorretos.')).toBeInTheDocument()
  })

  it('should have a link to the register page', () => {
    renderWithRouter(<LoginForm />)
    expect(screen.getByRole('link', { name: /cadastr/i })).toBeInTheDocument()
  })
})
