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
const mockNavigate = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
  }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderAt = (path = '/login') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LoginForm />
    </MemoryRouter>
  )

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogin.mockResolvedValue(undefined)
  })

  it('should display email and password fields', () => {
    renderAt()
    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('should display a submit button', () => {
    renderAt()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    renderAt()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/e-?mail inválido/i)).toBeInTheDocument()
  })

  it('should show validation error when password is empty', async () => {
    renderAt()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/senha é obrigatória/i)).toBeInTheDocument()
  })

  it('should call useAuth().login with form data on valid submit', async () => {
    renderAt()
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
    renderAt()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'senhaerrada')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText('Email ou senha incorretos.')).toBeInTheDocument()
  })

  it('should have a link to the register page', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /cadastr/i })).toBeInTheDocument()
  })

  it('should have a "Esqueci minha senha" link pointing to /esqueci-senha', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /esqueci minha senha/i })).toHaveAttribute('href', '/esqueci-senha')
  })

  it('should show unverified email message and resend link when login returns EMAIL_NOT_VERIFIED', async () => {
    mockLogin.mockRejectedValueOnce({ code: 'EMAIL_NOT_VERIFIED', message: 'E-mail não verificado.' })
    renderAt()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'minhasenha123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/e-?mail ainda não foi confirmado/i)).toBeInTheDocument()
    const link = await screen.findByRole('link', { name: /reenviar e-?mail de verificação/i })
    expect(link).toHaveAttribute('href', '/verificar-email/enviado?email=joao%40example.com')
  })

  it('should show success banner when ?resetSuccess=1 is in URL', () => {
    renderAt('/login?resetSuccess=1')
    expect(screen.getByRole('status')).toHaveTextContent(/senha redefinida com sucesso/i)
  })

  describe('returnTo navigation', () => {
    it('should navigate to home when returnTo is absent', async () => {
      renderAt('/login')
      await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
      await userEvent.type(screen.getByLabelText(/senha/i), 'minhasenha123')
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })

    it('should navigate to returnTo path after successful login', async () => {
      renderAt('/login?returnTo=%2Fadocao%2Fabc-123')
      await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
      await userEvent.type(screen.getByLabelText(/senha/i), 'minhasenha123')
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/adocao/abc-123')
      })
    })
  })
})
