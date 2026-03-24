/**
 * @module shared
 * @file BottomNav.test.tsx
 * @description Tests for the mobile bottom navigation bar (auth-aware).
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '@/shared/components/layout/BottomNav'

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('BottomNav', () => {
  describe('when not authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
    })

    it('should render public tabs', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.getByRole('link', { name: /início/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /adoção/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /achados/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /serviços/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument()
    })

    it('should not render Pets or Perfil tabs', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.queryByRole('link', { name: /^pets$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /perfil/i })).not.toBeInTheDocument()
    })

    it('should link to correct public routes', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: /adoção/i })).toHaveAttribute('href', '/adocao')
      expect(screen.getByRole('link', { name: /achados/i })).toHaveAttribute('href', '/achados-perdidos')
      expect(screen.getByRole('link', { name: /serviços/i })).toHaveAttribute('href', '/servicos')
      expect(screen.getByRole('link', { name: /entrar/i })).toHaveAttribute('href', '/login')
    })
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true } as any)
    })

    it('should render private tabs', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.getByRole('link', { name: /início/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /^pets$/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /adoção/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /achados/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
    })

    it('should not render Serviços or Entrar tabs', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.queryByRole('link', { name: /serviços/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument()
    })

    it('should link to correct private routes', () => {
      renderWithRouter(<BottomNav />)
      expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: /^pets$/i })).toHaveAttribute('href', '/pets')
      expect(screen.getByRole('link', { name: /adoção/i })).toHaveAttribute('href', '/adocao')
      expect(screen.getByRole('link', { name: /achados/i })).toHaveAttribute('href', '/achados-perdidos')
      expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute('href', '/perfil')
    })
  })

  it('should have lg:hidden class for mobile-only display', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
    const { container } = renderWithRouter(<BottomNav />)
    expect(container.firstChild).toHaveClass('lg:hidden')
  })

  it('should have a nav role', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false } as any)
    renderWithRouter(<BottomNav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
