/**
 * @module auth
 * @file ForgotPasswordSentPage.test.tsx
 * @description Tests for ForgotPasswordSentPage — confirmation after password reset email is sent.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordSentPage from '@/modules/auth/pages/ForgotPasswordSentPage'

const renderAt = (path = '/esqueci-senha/enviado') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ForgotPasswordSentPage />
    </MemoryRouter>
  )

describe('ForgotPasswordSentPage', () => {
  it('should display title and message', () => {
    renderAt()
    expect(screen.getByRole('heading', { name: /e-?mail enviado/i })).toBeInTheDocument()
    expect(screen.getByText(/link para redefinir/i)).toBeInTheDocument()
  })

  it('should display the email when ?email= is in the URL', () => {
    renderAt('/esqueci-senha/enviado?email=joao%40example.com')
    expect(screen.getByText(/joao@example\.com/)).toBeInTheDocument()
  })

  it('should show generic text when ?email= is absent', () => {
    renderAt('/esqueci-senha/enviado')
    expect(screen.getByText(/estiver cadastrado/i)).toBeInTheDocument()
  })

  it('should have a "Tentar outro e-mail" link pointing to /esqueci-senha', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /tentar outro e-?mail/i })).toHaveAttribute(
      'href',
      '/esqueci-senha',
    )
  })

  it('should have a "Voltar ao login" link pointing to /login', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /voltar ao login/i })).toHaveAttribute('href', '/login')
  })
})
