/**
 * @module shared
 * @file ContactGate.test.tsx
 * @description Tests for the ContactGate component — shows contact info to
 * authenticated users and a login CTA to unauthenticated users.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContactGate from '@/shared/components/ui/ContactGate'

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const renderAt = (ui: React.ReactElement, path = '/') =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)

describe('ContactGate', () => {
  describe('when value is null', () => {
    it('should render nothing regardless of auth state', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
      const { container } = renderAt(<ContactGate value={null} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true } as any)
    })

    it('should display the contact value as text', () => {
      renderAt(<ContactGate value="contato@email.com" />)
      expect(screen.getByText('contato@email.com')).toBeInTheDocument()
    })

    it('should render as a link when href is provided', () => {
      renderAt(<ContactGate value="contato@email.com" href="mailto:contato@email.com" />)
      const link = screen.getByRole('link', { name: 'contato@email.com' })
      expect(link).toHaveAttribute('href', 'mailto:contato@email.com')
    })

    it('should not render the login CTA', () => {
      renderAt(<ContactGate value="contato@email.com" />)
      expect(screen.queryByText(/fazer login/i)).not.toBeInTheDocument()
    })
  })

  describe('when not authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
    })

    it('should show the login CTA', () => {
      renderAt(<ContactGate value="contato@email.com" />)
      expect(screen.getByRole('link', { name: /fazer login/i })).toBeInTheDocument()
    })

    it('should not display the contact value', () => {
      renderAt(<ContactGate value="contato@email.com" />)
      expect(screen.queryByText('contato@email.com')).not.toBeInTheDocument()
    })

    it('should link to /login with returnTo set to the current path', () => {
      renderAt(<ContactGate value="contato@email.com" />, '/adocao/abc-123')
      const link = screen.getByRole('link', { name: /fazer login/i })
      const href = link.getAttribute('href') ?? ''
      expect(href).toContain('/login')
      expect(href).toContain('returnTo')
      expect(href).toContain('adocao')
    })
  })
})
