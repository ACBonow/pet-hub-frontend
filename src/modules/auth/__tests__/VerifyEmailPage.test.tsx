/**
 * @module auth
 * @file VerifyEmailPage.test.tsx
 * @description Tests for VerifyEmailPage — processes verification token from URL.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import VerifyEmailPage from '@/modules/auth/pages/VerifyEmailPage'

const mockVerifyEmail = jest.fn()
const mockNavigate = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    verifyEmail: mockVerifyEmail,
  }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderAt = (path = '/verificar-email') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <VerifyEmailPage />
    </MemoryRouter>
  )

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to /verificar-email/enviado when no token in URL', async () => {
    renderAt('/verificar-email')
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verificar-email/enviado', { replace: true })
    })
  })

  it('should show spinner while verifying', () => {
    mockVerifyEmail.mockReturnValue(new Promise(() => {})) // never resolves
    renderAt('/verificar-email?token=abc123')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should show success message after verifyEmail resolves', async () => {
    mockVerifyEmail.mockResolvedValueOnce(undefined)
    renderAt('/verificar-email?token=abc123')
    expect(await screen.findByText(/verificado com sucesso/i)).toBeInTheDocument()
  })

  it('should show "Entrar agora" link after success', async () => {
    mockVerifyEmail.mockResolvedValueOnce(undefined)
    renderAt('/verificar-email?token=abc123')
    const link = await screen.findByRole('link', { name: /entrar agora/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  it('should show invalid token message when verifyEmail rejects with INVALID_VERIFICATION_TOKEN', async () => {
    mockVerifyEmail.mockRejectedValueOnce({ code: 'INVALID_VERIFICATION_TOKEN', message: 'Token inválido.' })
    renderAt('/verificar-email?token=bad')
    expect(await screen.findByText(/link de verificação inválido/i)).toBeInTheDocument()
  })

  it('should show expired token message when verifyEmail rejects with VERIFICATION_TOKEN_EXPIRED', async () => {
    mockVerifyEmail.mockRejectedValueOnce({ code: 'VERIFICATION_TOKEN_EXPIRED', message: 'Token expirado.' })
    renderAt('/verificar-email?token=expired')
    expect(await screen.findByText(/link expirado/i)).toBeInTheDocument()
  })

  it('should show "Solicitar novo link" link on error', async () => {
    mockVerifyEmail.mockRejectedValueOnce({ code: 'INVALID_VERIFICATION_TOKEN', message: 'Token inválido.' })
    renderAt('/verificar-email?token=bad')
    const link = await screen.findByRole('link', { name: /solicitar novo link/i })
    expect(link).toHaveAttribute('href', '/verificar-email/enviado')
  })
})
