/**
 * @module organization
 * @file OrganizationDetailPage.test.tsx
 * @description Tests for OrganizationDetailPage — myRole-based visibility and members list.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OrganizationDetailPage from '@/modules/organization/pages/OrganizationDetailPage'

// ─── Layout mocks ────────────────────────────────────────────────────────────

jest.mock('@/shared/components/layout/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/shared/components/layout/Header', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('@/shared/components/layout/PageWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// ─── Hook mock ───────────────────────────────────────────────────────────────

const mockGetOrganization = jest.fn()
const mockGetMembers = jest.fn()
const mockUploadOrgPhoto = jest.fn()

const hookState = {
  organization: null as object | null,
  members: [] as object[],
  isLoading: false,
  error: null as string | null,
}

jest.mock('@/modules/organization/hooks/useOrganization', () => ({
  useOrganization: () => ({
    organization: hookState.organization,
    members: hookState.members,
    isLoading: hookState.isLoading,
    error: hookState.error,
    getOrganization: mockGetOrganization,
    getMembers: mockGetMembers,
    uploadOrgPhoto: mockUploadOrgPhoto,
  }),
}))

// ─── Fixtures ────────────────────────────────────────────────────────────────

const ORG_BASE = {
  id: 'org-1',
  name: 'Pet Rescue ONG',
  type: 'NGO',
  cnpj: null,
  email: 'contato@petrescue.org',
  phone: '11999999999',
  description: 'Uma ONG dedicada ao resgate de animais.',
  website: null,
  instagram: null,
  photoUrl: null,
  addressStreet: null,
  addressNeighborhood: null,
  addressNumber: null,
  addressCep: null,
  addressCity: null,
  addressState: null,
  responsiblePersons: [
    { personId: 'person-1', role: 'OWNER', organizationId: 'org-1', assignedAt: '2026-01-01T00:00:00.000Z' },
    { personId: 'person-2', role: 'MANAGER', organizationId: 'org-1', assignedAt: '2026-01-01T00:00:00.000Z' },
    { personId: 'person-3', role: 'MEMBER', organizationId: 'org-1', assignedAt: '2026-01-01T00:00:00.000Z' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/organizacoes/org-1']}>
      <Routes>
        <Route path="/organizacoes/:id" element={<OrganizationDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('OrganizationDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    hookState.organization = null
    hookState.members = []
    hookState.isLoading = false
    hookState.error = null
  })

  it('should call getOrganization and getMembers on mount', async () => {
    hookState.organization = ORG_BASE
    renderPage()
    await waitFor(() => {
      expect(mockGetOrganization).toHaveBeenCalledWith('org-1')
      expect(mockGetMembers).toHaveBeenCalledWith('org-1')
    })
  })

  it('should display org name and type', () => {
    hookState.organization = ORG_BASE
    renderPage()
    expect(screen.getByText('Pet Rescue ONG')).toBeInTheDocument()
    expect(screen.getByText('ONG')).toBeInTheDocument()
  })

  it('should display description when present', () => {
    hookState.organization = ORG_BASE
    renderPage()
    expect(screen.getByText('Uma ONG dedicada ao resgate de animais.')).toBeInTheDocument()
  })

  it('should show loading message when isLoading', () => {
    hookState.isLoading = true
    renderPage()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('should show error message when error is set', () => {
    hookState.error = 'Organização não encontrada.'
    renderPage()
    expect(screen.getByRole('alert')).toHaveTextContent('Organização não encontrada.')
  })

  // ── myRole-based visibility ──────────────────────────────────────────────────

  it('should show edit link when myRole is OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(screen.getByRole('link', { name: /editar/i })).toBeInTheDocument()
  })

  it('should NOT show edit link when myRole is MANAGER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    renderPage()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('should NOT show edit link when myRole is MEMBER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MEMBER' }
    renderPage()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  it('should NOT show edit link when user is not a member (no myRole)', () => {
    hookState.organization = { ...ORG_BASE }
    renderPage()
    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument()
  })

  // ── Members list ─────────────────────────────────────────────────────────────

  it('should display members section heading', () => {
    hookState.organization = ORG_BASE
    renderPage()
    expect(screen.getByText(/membros/i)).toBeInTheDocument()
  })

  it('should display role badge for each responsible person', () => {
    hookState.organization = ORG_BASE
    renderPage()
    expect(screen.getByText('OWNER')).toBeInTheDocument()
    expect(screen.getByText('MANAGER')).toBeInTheDocument()
    expect(screen.getByText('MEMBER')).toBeInTheDocument()
  })

  // ── Photo display ────────────────────────────────────────────────────────────

  it('should display org photo when photoUrl is present', () => {
    hookState.organization = { ...ORG_BASE, photoUrl: 'https://cdn.example.com/org.jpg' }
    renderPage()
    const img = screen.getByRole('img', { name: /pet rescue ong/i })
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/org.jpg')
  })

  it('should show "Alterar foto" button when myRole is OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(screen.getByRole('button', { name: /alterar foto/i })).toBeInTheDocument()
  })

  it('should show "Alterar foto" button when myRole is MANAGER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    renderPage()
    expect(screen.getByRole('button', { name: /alterar foto/i })).toBeInTheDocument()
  })

  it('should NOT show "Alterar foto" button when myRole is MEMBER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MEMBER' }
    renderPage()
    expect(screen.queryByRole('button', { name: /alterar foto/i })).not.toBeInTheDocument()
  })

  it('should NOT show "Alterar foto" button when user is not a member', () => {
    hookState.organization = { ...ORG_BASE }
    renderPage()
    expect(screen.queryByRole('button', { name: /alterar foto/i })).not.toBeInTheDocument()
  })

  it('should call uploadOrgPhoto when file is selected via "Alterar foto"', async () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    mockUploadOrgPhoto.mockResolvedValue(undefined)
    renderPage()

    const file = new File(['img'], 'org.jpg', { type: 'image/jpeg' })
    const btn = screen.getByRole('button', { name: /alterar foto/i })
    await userEvent.click(btn)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    await waitFor(() => {
      expect(mockUploadOrgPhoto).toHaveBeenCalledWith('org-1', file)
    })
  })
})
