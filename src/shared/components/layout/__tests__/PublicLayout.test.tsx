/**
 * @module shared
 * @file PublicLayout.test.tsx
 * @description Tests for the public page layout wrapper.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn(),
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

  it('should render the brand name via TopNav', () => {
    renderWithRouter(<PublicLayout><div /></PublicLayout>)
    expect(screen.getByText('PetHUB')).toBeInTheDocument()
  })

  it('should render navigation elements', () => {
    renderWithRouter(<PublicLayout><div /></PublicLayout>)
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1)
  })
})
