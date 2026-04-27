import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ logout: jest.fn() }),
}))

import { useAuthStore } from '@/modules/auth/store/authSlice'
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('PublicLayout', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, user: null } as any)
  })

  it('should render children', () => {
    renderWithRouter(
      <PublicLayout>
        <p>conteúdo da página</p>
      </PublicLayout>
    )
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
  })

  it('should render the brand name in the sidebar', () => {
    renderWithRouter(<PublicLayout><div /></PublicLayout>)
    expect(screen.getByLabelText(/tchê pethub/i)).toBeInTheDocument()
  })

  it('should render navigation elements', () => {
    renderWithRouter(<PublicLayout><div /></PublicLayout>)
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1)
  })

  it('should render the Entrar link when not authenticated', () => {
    renderWithRouter(<PublicLayout><div /></PublicLayout>)
    expect(screen.getAllByRole('link', { name: /entrar/i }).length).toBeGreaterThanOrEqual(1)
  })
})
