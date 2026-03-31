/**
 * @module shared
 * @file ActingAsSelector.test.tsx
 * @description Tests for ActingAsSelector component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActingAsSelector from '@/shared/components/ui/ActingAsSelector'
import type { ActingAsContext } from '@/shared/hooks/useActingAs'

const mockSetContext = jest.fn()
let mockContext: ActingAsContext = { type: 'person' }
let mockAvailableOrgs: { id: string; name: string }[] = []

jest.mock('@/shared/hooks/useActingAs', () => ({
  useActingAs: () => ({
    context: mockContext,
    availableOrgs: mockAvailableOrgs,
    setContext: mockSetContext,
  }),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockContext = { type: 'person' } as ActingAsContext
  mockAvailableOrgs = []
})

describe('ActingAsSelector', () => {
  it('does not render when availableOrgs is empty', () => {
    mockAvailableOrgs = []
    const { container } = render(<ActingAsSelector />)
    expect(container.firstChild).toBeNull()
  })

  it('renders dropdown with "Eu (pessoal)" and org options when orgs are available', () => {
    mockAvailableOrgs = [
      { id: 'org-1', name: 'ONG Amigos dos Pets' },
      { id: 'org-2', name: 'Pet Shop Central' },
    ]

    render(<ActingAsSelector />)

    expect(screen.getByLabelText(/criar como/i)).toBeInTheDocument()
    expect(screen.getByText('Eu (pessoal)')).toBeInTheDocument()
    expect(screen.getByText('ONG Amigos dos Pets')).toBeInTheDocument()
    expect(screen.getByText('Pet Shop Central')).toBeInTheDocument()
  })

  it('calls setContext with org context when an org is selected', async () => {
    mockAvailableOrgs = [{ id: 'org-1', name: 'ONG Amigos' }]

    render(<ActingAsSelector />)

    await userEvent.selectOptions(screen.getByLabelText(/criar como/i), 'org-1')

    expect(mockSetContext).toHaveBeenCalledWith({
      type: 'org',
      organizationId: 'org-1',
      organizationName: 'ONG Amigos',
    })
  })

  it('calls setContext with person context when "Eu (pessoal)" is selected', async () => {
    mockContext = { type: 'org', organizationId: 'org-1' }
    mockAvailableOrgs = [{ id: 'org-1', name: 'ONG Amigos' }]

    render(<ActingAsSelector />)

    await userEvent.selectOptions(screen.getByLabelText(/criar como/i), '')

    expect(mockSetContext).toHaveBeenCalledWith({ type: 'person' })
  })
})
