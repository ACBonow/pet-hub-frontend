/**
 * @module shared
 * @file useActingAs.test.ts
 * @description Tests for useActingAs hook.
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useActingAs } from '@/shared/hooks/useActingAs'

jest.mock('@/modules/organization/services/organization.service', () => ({
  listMyOrganizationsRequest: jest.fn(),
}))

const mockListMyOrganizationsRequest = jest.requireMock(
  '@/modules/organization/services/organization.service',
).listMyOrganizationsRequest

beforeEach(async () => {
  jest.clearAllMocks()
  mockListMyOrganizationsRequest.mockResolvedValue([])
  // Reset Zustand store state between tests
  const { useActingAsStore } = await import('@/shared/hooks/useActingAs')
  useActingAsStore.setState({ context: { type: 'person' }, availableOrgs: [] })
})

describe('useActingAs', () => {
  it('returns { type: "person" } by default', async () => {
    mockListMyOrganizationsRequest.mockResolvedValue([])

    const { result } = renderHook(() => useActingAs())

    await waitFor(() => {
      expect(result.current.context.type).toBe('person')
    })
  })

  it('populates availableOrgs with OWNER and MANAGER orgs only', async () => {
    mockListMyOrganizationsRequest.mockResolvedValue([
      { id: 'org-1', name: 'Org Owner', myRole: 'OWNER' },
      { id: 'org-2', name: 'Org Manager', myRole: 'MANAGER' },
      { id: 'org-3', name: 'Org Member', myRole: 'MEMBER' },
    ])

    const { result } = renderHook(() => useActingAs())

    await waitFor(() => {
      expect(result.current.availableOrgs).toHaveLength(2)
      expect(result.current.availableOrgs[0].id).toBe('org-1')
      expect(result.current.availableOrgs[1].id).toBe('org-2')
    })
  })

  it('setContext updates the context', async () => {
    mockListMyOrganizationsRequest.mockResolvedValue([
      { id: 'org-1', name: 'Org Owner', myRole: 'OWNER' },
    ])

    const { result } = renderHook(() => useActingAs())

    await waitFor(() => {
      expect(result.current.availableOrgs).toHaveLength(1)
    })

    act(() => {
      result.current.setContext({ type: 'org', organizationId: 'org-1', organizationName: 'Org Owner' })
    })

    expect(result.current.context.type).toBe('org')
    expect(result.current.context.organizationId).toBe('org-1')
  })

  it('returns empty availableOrgs when user has no OWNER/MANAGER orgs', async () => {
    mockListMyOrganizationsRequest.mockResolvedValue([
      { id: 'org-3', name: 'Only Member', myRole: 'MEMBER' },
    ])

    const { result } = renderHook(() => useActingAs())

    await waitFor(() => {
      expect(result.current.availableOrgs).toHaveLength(0)
    })
  })

  it('silently handles API error without crashing', async () => {
    mockListMyOrganizationsRequest.mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useActingAs())

    await waitFor(() => {
      expect(result.current.availableOrgs).toHaveLength(0)
    })
    expect(result.current.context.type).toBe('person')
  })
})
