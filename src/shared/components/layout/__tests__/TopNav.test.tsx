/**
 * @module shared
 * @file TopNav.test.tsx
 * @description Tests for the desktop top navigation bar.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TopNav from '@/shared/components/layout/TopNav'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

const mockLogout = jest.fn()
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('TopNav', () => {
  describe('when not authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
    })

    it('should render the brand name', () => {
      renderWithRouter(<TopNav />)
      expect(screen.getByText('PetHUB')).toBeInTheDocument()
    })

    it('should render public navigation links', () => {
      renderWithRouter(<TopNav />)
      expect(screen.getByRole('link', { name: /adoção/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /achados e perdidos/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /serviços/i })).toBeInTheDocument()
    })

    it('should render Entrar link pointing to /login', () => {
      renderWithRouter(<TopNav />)
      const entrar = screen.getByRole('link', { name: /entrar/i })
      expect(entrar).toBeInTheDocument()
      expect(entrar).toHaveAttribute('href', '/login')
    })

    it('should not render user name', () => {
      renderWithRouter(<TopNav />)
      expect(screen.queryByText(/arthur/i)).not.toBeInTheDocument()
    })
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockLogout.mockReset()
      mockNavigate.mockReset()
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', name: 'Arthur', email: 'arthur@email.com' },
      } as any)
    })

    it('should render the user name', () => {
      renderWithRouter(<TopNav />)
      expect(screen.getByText('Arthur')).toBeInTheDocument()
    })

    it('should not render Entrar link', () => {
      renderWithRouter(<TopNav />)
      expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument()
    })

    it('should render a Sair button', () => {
      renderWithRouter(<TopNav />)
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })

    it('should call logout and navigate to home when Sair is clicked', async () => {
      mockLogout.mockResolvedValue(undefined)
      renderWithRouter(<TopNav />)
      await userEvent.click(screen.getByRole('button', { name: /sair/i }))
      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should be hidden on mobile and visible on desktop', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
    const { container } = renderWithRouter(<TopNav />)
    expect(container.firstChild).toHaveClass('hidden')
    expect(container.firstChild).toHaveClass('lg:flex')
  })
})
