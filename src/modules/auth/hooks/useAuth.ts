/**
 * @module auth
 * @file useAuth.ts
 * @description Hook combining auth store state with auth service calls.
 */

import { useAuthStore } from '@/modules/auth/store/authSlice'
import { loginRequest, registerRequest, logoutRequest } from '@/modules/auth/services/auth.service'
import type { LoginCredentials, RegisterData, AuthUser } from '@/modules/auth/types'

export function useAuth() {
  const { accessToken, user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken: token, user: authUser } = await loginRequest(credentials)
    setAuth(token, authUser)
  }

  async function register(data: RegisterData): Promise<void> {
    const { accessToken: token, user: authUser } = await registerRequest(data)
    setAuth(token, authUser)
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest()
    } finally {
      clearAuth()
    }
  }

  return {
    accessToken,
    user: user as AuthUser | null,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
