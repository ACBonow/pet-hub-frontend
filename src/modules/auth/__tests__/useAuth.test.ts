/**
 * @module auth
 * @file useAuth.test.ts
 * @description Tests for the useAuth hook — login, logout, isAuthenticated state.
 */

import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import * as authService from '@/modules/auth/services/auth.service'

jest.mock('@/modules/auth/services/auth.service')

const mockAuthService = authService as jest.Mocked<typeof authService>

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the store directly between tests
    act(() => {
      useAuthStore.getState().clearAuth()
    })
  })

  describe('initial state', () => {
    it('should start unauthenticated', () => {
      const { result } = renderHook(() => useAuth())
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.accessToken).toBeNull()
      expect(result.current.user).toBeNull()
    })
  })

  describe('login', () => {
    it('should store accessToken and user after successful login', async () => {
      mockAuthService.loginRequest.mockResolvedValueOnce({
        accessToken: 'jwt-access-token-123',
        user: { id: 'user-1', name: 'João Silva', email: 'joao@example.com' },
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ email: 'joao@example.com', password: 'senha123' })
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.accessToken).toBe('jwt-access-token-123')
      expect(result.current.user?.email).toBe('joao@example.com')
    })

    it('should NOT store token in localStorage', async () => {
      mockAuthService.loginRequest.mockResolvedValueOnce({
        accessToken: 'jwt-token',
        user: { id: 'u1', name: 'Test', email: 'test@example.com' },
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'pass' })
      })

      expect(localStorage.getItem('accessToken')).toBeNull()
    })

    it('should throw when login fails', async () => {
      mockAuthService.loginRequest.mockRejectedValueOnce({
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha incorretos.',
      })

      const { result } = renderHook(() => useAuth())

      await expect(
        act(async () => {
          await result.current.login({ email: 'x@x.com', password: 'wrong' })
        }),
      ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' })

      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear store after logout', async () => {
      mockAuthService.loginRequest.mockResolvedValueOnce({
        accessToken: 'token',
        user: { id: 'u1', name: 'Test', email: 'test@example.com' },
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'pass' })
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.accessToken).toBeNull()
      expect(result.current.user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should be true when accessToken is set', async () => {
      mockAuthService.loginRequest.mockResolvedValueOnce({
        accessToken: 'any-token',
        user: { id: 'u1', name: 'Test', email: 'test@example.com' },
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'pass' })
      })

      expect(result.current.isAuthenticated).toBe(true)
    })
  })
})
