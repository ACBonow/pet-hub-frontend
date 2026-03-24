/**
 * @module auth
 * @file ForgotPasswordPage.test.tsx
 * @description Tests for ForgotPasswordPage — email input to request password reset link.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage'

const mockForgotPassword = jest.fn()
const mockNavigate = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    forgotPassword: mockForgotPassword,
  }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/esqueci-senha']}>
      <ForgotPasswordPage />
    </MemoryRouter>
  )

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockForgotPassword.mockResolvedValue(undefined)
  })

  it('should render email field and submit button', () => {
    renderPage()
    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar link/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'invalido')
    await userEvent.click(screen.getByRole('button', { name: /enviar link/i }))
    expect(await screen.findByText(/e-?mail inválido/i)).toBeInTheDocument()
  })

  it('should call forgotPassword with the email', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar link/i }))
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({ email: 'joao@example.com' })
    })
  })

  it('should navigate to /esqueci-senha/enviado?email=... after success', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar link/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/esqueci-senha/enviado?email=joao%40example.com',
      )
    })
  })

  it('should show generic error if forgotPassword throws', async () => {
    mockForgotPassword.mockRejectedValueOnce({ code: 'SERVER_ERROR', message: 'Erro interno.' })
    renderPage()
    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'joao@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar link/i }))
    expect(await screen.findByText(/erro interno/i)).toBeInTheDocument()
  })

  it('should have a "Voltar ao login" link pointing to /login', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /voltar ao login/i })).toHaveAttribute('href', '/login')
  })
})
