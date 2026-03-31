/**
 * @module organization
 * @file __tests__/OrganizationDashboardPage.test.tsx
 * @description Tests for OrganizationDashboardPage — tab visibility by role, tab navigation, and private route redirect.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import OrganizationDashboardPage from '@/modules/organization/pages/OrganizationDashboardPage'

// ─── Layout mocks ─────────────────────────────────────────────────────────────

jest.mock('@/shared/components/layout/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/shared/components/layout/Header', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('@/shared/components/layout/PageWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// ─── Hook mocks ───────────────────────────────────────────────────────────────

const mockGetOrganization = jest.fn()
const mockGetMembers = jest.fn()

const orgHookState = {
  organization: null as object | null,
  members: [] as Array<{ personId: string; name: string; role: string; assignedAt: string }>,
  isLoading: false,
  error: null as string | null,
}

jest.mock('@/modules/organization/hooks/useOrganization', () => ({
  useOrganization: () => ({
    organization: orgHookState.organization,
    members: orgHookState.members,
    isLoading: orgHookState.isLoading,
    error: orgHookState.error,
    getOrganization: mockGetOrganization,
    getMembers: mockGetMembers,
    uploadOrgPhoto: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    changeRole: jest.fn(),
  }),
}))

const mockLoadPets = jest.fn()
const mockLoadAdoptions = jest.fn()
const mockLoadReports = jest.fn()
const mockLoadServices = jest.fn()

const resourceState = {
  pets: [] as object[],
  adoptions: [] as object[],
  reports: [] as object[],
  services: [] as object[],
  isLoading: false,
  error: null as string | null,
}

jest.mock('@/modules/organization/hooks/useOrgResources', () => ({
  useOrgResources: () => ({
    pets: resourceState.pets,
    adoptions: resourceState.adoptions,
    reports: resourceState.reports,
    services: resourceState.services,
    isLoading: resourceState.isLoading,
    error: resourceState.error,
    loadPets: mockLoadPets,
    loadAdoptions: mockLoadAdoptions,
    loadReports: mockLoadReports,
    loadServices: mockLoadServices,
  }),
}))

// ─── Auth store mock ──────────────────────────────────────────────────────────

const authState = { isAuthenticated: true }

jest.mock('@/modules/auth/store/authSlice', () => ({
  useAuthStore: (selector: (s: typeof authState) => unknown) => selector(authState),
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ORG_BASE = {
  id: 'org-1',
  name: 'Pet Rescue ONG',
  type: 'NGO',
  cnpj: null,
  email: null,
  phone: null,
  description: null,
  website: null,
  instagram: null,
  photoUrl: null,
  addressStreet: null,
  addressNeighborhood: null,
  addressNumber: null,
  addressCep: null,
  addressCity: null,
  addressState: null,
  responsiblePersonIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function FakePrivateRoute() {
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

function renderPage(initialPath = '/organizacoes/org-1/painel') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<FakePrivateRoute />}>
          <Route path="/organizacoes/:id/painel" element={<OrganizationDashboardPage />} />
        </Route>
        <Route path="/login" element={<div>Página de login</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrganizationDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    orgHookState.organization = null
    orgHookState.members = []
    orgHookState.isLoading = false
    orgHookState.error = null
    resourceState.pets = []
    resourceState.adoptions = []
    resourceState.reports = []
    resourceState.services = []
    resourceState.isLoading = false
    resourceState.error = null
    authState.isAuthenticated = true
  })

  it('should call getOrganization and getMembers on mount', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(mockGetOrganization).toHaveBeenCalledWith('org-1')
    expect(mockGetMembers).toHaveBeenCalledWith('org-1')
  })

  // ── Tab visibility by role ───────────────────────────────────────────────────

  it('should display all 6 tabs for OWNER', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Membros' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Pets' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Adoções' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Achados/Perdidos' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Serviços' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(6)
  })

  it('should NOT display Membros tab for MANAGER', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    renderPage()
    expect(screen.queryByRole('tab', { name: 'Membros' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })

  it('should NOT display Membros tab for MEMBER', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'MEMBER' }
    renderPage()
    expect(screen.queryByRole('tab', { name: 'Membros' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })

  // ── OrgDataTab edit link visibility ──────────────────────────────────────────

  it('should show Editar link in Dados tab for OWNER', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    // Dados tab is active by default
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('should NOT show Editar link in Dados tab for MANAGER', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    renderPage()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  // ── Tab navigation ───────────────────────────────────────────────────────────

  it('should show Dados content by default', () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('aria-selected', 'true')
  })

  it('should switch to Pets tab on click', async () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()

    await userEvent.click(screen.getByRole('tab', { name: 'Pets' }))

    expect(screen.getByRole('tab', { name: 'Pets' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('aria-selected', 'false')
  })

  it('should switch to Adoções tab on click', async () => {
    orgHookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()

    await userEvent.click(screen.getByRole('tab', { name: 'Adoções' }))

    expect(screen.getByRole('tab', { name: 'Adoções' })).toHaveAttribute('aria-selected', 'true')
  })

  // ── Private route ─────────────────────────────────────────────────────────────

  it('should redirect unauthenticated user to login', () => {
    authState.isAuthenticated = false
    renderPage()
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })
})
