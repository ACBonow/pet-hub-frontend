/**
 * @module auth
 * @file ResetPasswordPage.test.tsx
 * @description Tests for ResetPasswordPage — new password form with token from URL.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage'

const mockResetPassword = jest.fn()
const mockNavigate = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    resetPassword: mockResetPassword,
  }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderAt = (path = '/redefinir-senha') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ResetPasswordPage />
    </MemoryRouter>
  )

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResetPassword.mockResolvedValue(undefined)
  })

  it('should redirect to /esqueci-senha when no token in URL', async () => {
    renderAt('/redefinir-senha')
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/esqueci-senha', { replace: true })
    })
  })

  it('should render new password and confirm password fields when token is present', () => {
    renderAt('/redefinir-senha?token=tok123')
    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar nova senha')).toBeInTheDocument()
  })

  it('should show error when passwords do not match', async () => {
    renderAt('/redefinir-senha?token=tok123')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'Senha@12345')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'Diferente@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    expect(await screen.findByText(/senhas não coincidem/i)).toBeInTheDocument()
  })

  it('should show error when password is too short', async () => {
    renderAt('/redefinir-senha?token=tok123')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'curta')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'curta')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    expect(await screen.findByText(/pelo menos 8 caracteres/i)).toBeInTheDocument()
  })

  it('should call resetPassword with token from URL and newPassword', async () => {
    renderAt('/redefinir-senha?token=tok123')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'NovaSenha@1')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'NovaSenha@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({ token: 'tok123', newPassword: 'NovaSenha@1' })
    })
  })

  it('should navigate to /login?resetSuccess=1 after success', async () => {
    renderAt('/redefinir-senha?token=tok123')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'NovaSenha@1')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'NovaSenha@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login?resetSuccess=1')
    })
  })

  it('should show invalid token error when resetPassword rejects with INVALID_RESET_TOKEN', async () => {
    mockResetPassword.mockRejectedValueOnce({ code: 'INVALID_RESET_TOKEN', message: 'Token inválido.' })
    renderAt('/redefinir-senha?token=bad')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'NovaSenha@1')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'NovaSenha@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    expect(await screen.findByText(/link de redefinição inválido/i)).toBeInTheDocument()
  })

  it('should show expired token error when resetPassword rejects with RESET_TOKEN_EXPIRED', async () => {
    mockResetPassword.mockRejectedValueOnce({ code: 'RESET_TOKEN_EXPIRED', message: 'Token expirado.' })
    renderAt('/redefinir-senha?token=expired')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'NovaSenha@1')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'NovaSenha@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    expect(await screen.findByText(/link expirado/i)).toBeInTheDocument()
  })

  it('should show "Solicitar novo link" link on token error', async () => {
    mockResetPassword.mockRejectedValueOnce({ code: 'INVALID_RESET_TOKEN', message: 'Token inválido.' })
    renderAt('/redefinir-senha?token=bad')
    await userEvent.type(screen.getByLabelText('Nova senha'), 'NovaSenha@1')
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), 'NovaSenha@1')
    await userEvent.click(screen.getByRole('button', { name: /redefinir senha/i }))
    const link = await screen.findByRole('link', { name: /solicitar novo link/i })
    expect(link).toHaveAttribute('href', '/esqueci-senha')
  })
})
