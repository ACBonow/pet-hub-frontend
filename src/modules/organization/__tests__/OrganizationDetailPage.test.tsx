/**
 * @module organization
 * @file OrganizationDetailPage.test.tsx
 * @description Tests for OrganizationDetailPage — myRole-based visibility, members list, and member management.
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

// ─── CpfInput mock (simplified for tests) ────────────────────────────────────

jest.mock('@/shared/components/forms/CpfInput', () => ({
  __esModule: true,
  default: ({ name, label, control }: { name: string; label?: string; control: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useController } = require('react-hook-form')
    const { field } = useController({ name, control, defaultValue: '' })
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input id={name} {...field} />
      </div>
    )
  },
}))

// ─── CPF validator mock ───────────────────────────────────────────────────────

jest.mock('@/shared/validators/cpf.validator', () => ({
  validateCpf: () => true,
  sanitizeCpf: (v: string) => v.replace(/\D/g, ''),
}))

// ─── Hook mock ───────────────────────────────────────────────────────────────

const mockGetOrganization = jest.fn()
const mockGetMembers = jest.fn()
const mockUploadOrgPhoto = jest.fn()
const mockAddMember = jest.fn()
const mockRemoveMember = jest.fn()
const mockChangeRole = jest.fn()

const hookState = {
  organization: null as object | null,
  members: [] as Array<{ personId: string; name: string; role: string; assignedAt: string }>,
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
    addMember: mockAddMember,
    removeMember: mockRemoveMember,
    changeRole: mockChangeRole,
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
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const MOCK_MEMBERS = [
  { personId: 'person-1', name: 'Ana Silva', role: 'OWNER', assignedAt: '2026-01-01T00:00:00.000Z' },
  { personId: 'person-2', name: 'Bruno Costa', role: 'MANAGER', assignedAt: '2026-01-01T00:00:00.000Z' },
  { personId: 'person-3', name: 'Carlos Pereira', role: 'MEMBER', assignedAt: '2026-01-01T00:00:00.000Z' },
]

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
    expect(screen.getByText(/^membros$/i)).toBeInTheDocument()
  })

  it('should display member names and role badges', () => {
    hookState.organization = ORG_BASE
    hookState.members = MOCK_MEMBERS
    renderPage()
    expect(screen.getByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByText('Bruno Costa')).toBeInTheDocument()
    expect(screen.getByText('OWNER')).toBeInTheDocument()
    expect(screen.getByText('MANAGER')).toBeInTheDocument()
    expect(screen.getByText('MEMBER')).toBeInTheDocument()
  })

  it('should show empty state when members list is empty', () => {
    hookState.organization = ORG_BASE
    hookState.members = []
    renderPage()
    expect(screen.getByText(/nenhum membro/i)).toBeInTheDocument()
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

  // ── Member management — OWNER only ────────────────────────────────────────────

  it('should show add member form when myRole is OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    renderPage()
    expect(screen.getByRole('form', { name: /adicionar membro/i })).toBeInTheDocument()
  })

  it('should NOT show add member form when myRole is MANAGER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    renderPage()
    expect(screen.queryByRole('form', { name: /adicionar membro/i })).not.toBeInTheDocument()
  })

  it('should NOT show add member form when myRole is MEMBER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MEMBER' }
    renderPage()
    expect(screen.queryByRole('form', { name: /adicionar membro/i })).not.toBeInTheDocument()
  })

  it('should call addMember and refresh members on form submit', async () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    mockAddMember.mockResolvedValue(undefined)
    mockGetMembers.mockResolvedValue(undefined)
    renderPage()

    await userEvent.type(screen.getByLabelText('CPF'), '12345678901')
    await userEvent.click(screen.getByRole('button', { name: /^adicionar$/i }))

    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalledWith('org-1', '12345678901', 'MEMBER')
      expect(mockGetMembers).toHaveBeenCalledWith('org-1')
    })
  })

  it('should show error message when addMember fails', async () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    mockAddMember.mockRejectedValue({ message: 'Nenhuma pessoa encontrada com este CPF.', code: 'PERSON_NOT_FOUND' })
    renderPage()

    await userEvent.type(screen.getByLabelText('CPF'), '12345678901')
    await userEvent.click(screen.getByRole('button', { name: /^adicionar$/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('alert').some(
        (el) => el.textContent?.includes('Nenhuma pessoa'),
      )).toBe(true)
    })
  })

  it('should show remove button per member when OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    hookState.members = MOCK_MEMBERS
    renderPage()
    expect(screen.getByRole('button', { name: /remover ana silva/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remover bruno costa/i })).toBeInTheDocument()
  })

  it('should NOT show remove buttons when not OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    hookState.members = MOCK_MEMBERS
    renderPage()
    expect(screen.queryByRole('button', { name: /remover/i })).not.toBeInTheDocument()
  })

  it('should call removeMember and refresh members on remove click', async () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    hookState.members = MOCK_MEMBERS
    mockRemoveMember.mockResolvedValue(undefined)
    mockGetMembers.mockResolvedValue(undefined)
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /remover ana silva/i }))

    await waitFor(() => {
      expect(mockRemoveMember).toHaveBeenCalledWith('org-1', 'person-1')
      expect(mockGetMembers).toHaveBeenCalledWith('org-1')
    })
  })

  it('should show role select per member when OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    hookState.members = MOCK_MEMBERS
    renderPage()
    expect(screen.getByRole('combobox', { name: /papel de ana silva/i })).toBeInTheDocument()
  })

  it('should NOT show role selects when not OWNER', () => {
    hookState.organization = { ...ORG_BASE, myRole: 'MANAGER' }
    hookState.members = MOCK_MEMBERS
    renderPage()
    expect(screen.queryByRole('combobox', { name: /papel de/i })).not.toBeInTheDocument()
  })

  it('should call changeRole and refresh members when role select changes', async () => {
    hookState.organization = { ...ORG_BASE, myRole: 'OWNER' }
    hookState.members = MOCK_MEMBERS
    mockChangeRole.mockResolvedValue(undefined)
    mockGetMembers.mockResolvedValue(undefined)
    renderPage()

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /papel de ana silva/i }),
      'MANAGER',
    )

    await waitFor(() => {
      expect(mockChangeRole).toHaveBeenCalledWith('org-1', 'person-1', 'MANAGER')
      expect(mockGetMembers).toHaveBeenCalledWith('org-1')
    })
  })
})
