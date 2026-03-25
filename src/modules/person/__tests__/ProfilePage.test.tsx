/**
 * @module person
 * @file ProfilePage.test.tsx
 * @description Tests for the profile page, including logout action.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '@/modules/person/pages/ProfilePage'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: jest.fn((selector: (s: any) => any) =>
    selector({ user: { id: '1', name: 'Arthur', email: 'arthur@email.com' } })
  ),
}))

const mockLogout = jest.fn()
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}))

jest.mock('@/shared/components/layout/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/shared/components/layout/Header', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))

jest.mock('@/shared/components/layout/PageWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/modules/person/components/PersonProfile', () => ({
  default: () => <div>PersonProfile</div>,
}))

const renderPage = () => render(<MemoryRouter><ProfilePage /></MemoryRouter>)

describe('ProfilePage', () => {
  beforeEach(() => {
    mockLogout.mockReset()
    mockNavigate.mockReset()
  })

  it('should render the page title', () => {
    renderPage()
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument()
  })

  it('should render a Sair button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('should call logout and navigate to home when Sair is clicked', async () => {
    mockLogout.mockResolvedValue(undefined)
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /sair/i }))
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
