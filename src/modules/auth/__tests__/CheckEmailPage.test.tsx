/**
 * @module auth
 * @file CheckEmailPage.test.tsx
 * @description Tests for CheckEmailPage — email sent after registration or resend.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CheckEmailPage from '@/modules/auth/pages/CheckEmailPage'

const mockResendVerification = jest.fn()

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    resendVerification: mockResendVerification,
  }),
}))

const renderAt = (path = '/verificar-email/enviado') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <CheckEmailPage />
    </MemoryRouter>
  )

describe('CheckEmailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResendVerification.mockResolvedValue(undefined)
  })

  it('should display title and instructions', () => {
    renderAt()
    expect(screen.getByRole('heading', { name: /verifique seu e-?mail/i })).toBeInTheDocument()
    expect(screen.getByText(/confirmação/i)).toBeInTheDocument()
  })

  it('should display the email when ?email= is in the URL', () => {
    renderAt('/verificar-email/enviado?email=joao%40example.com')
    expect(screen.getByText(/joao@example\.com/)).toBeInTheDocument()
  })

  it('should display a resend button', () => {
    renderAt()
    expect(screen.getByRole('button', { name: /reenviar/i })).toBeInTheDocument()
  })

  it('should call resendVerification when resend button is clicked with email from URL', async () => {
    renderAt('/verificar-email/enviado?email=joao%40example.com')
    await userEvent.click(screen.getByRole('button', { name: /reenviar/i }))
    await waitFor(() => {
      expect(mockResendVerification).toHaveBeenCalledWith({ email: 'joao@example.com' })
    })
  })

  it('should show success feedback after resend', async () => {
    renderAt('/verificar-email/enviado?email=joao%40example.com')
    await userEvent.click(screen.getByRole('button', { name: /reenviar/i }))
    expect(await screen.findByText(/reenviado/i)).toBeInTheDocument()
  })

  it('should disable resend button after click (cooldown)', async () => {
    renderAt('/verificar-email/enviado?email=joao%40example.com')
    const btn = screen.getByRole('button', { name: /reenviar/i })
    await userEvent.click(btn)
    expect(btn).toBeDisabled()
  })

  it('should show inline error if resendVerification throws', async () => {
    mockResendVerification.mockRejectedValueOnce({
      code: 'SERVER_ERROR',
      message: 'Erro ao reenviar.',
    })
    renderAt('/verificar-email/enviado?email=joao%40example.com')
    await userEvent.click(screen.getByRole('button', { name: /reenviar/i }))
    expect(await screen.findByText(/erro ao reenviar/i)).toBeInTheDocument()
  })

  it('should have a link to login page', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /entrar/i })).toHaveAttribute('href', '/login')
  })
})
