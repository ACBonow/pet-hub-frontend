/**
 * @module auth
 * @file authSlice.ts
 * @description Zustand store for authentication state.
 * Access token is stored in memory only — never in localStorage.
 */

import { create } from 'zustand'
import { setTokenGetter } from '@/shared/services/api.client'
import type { AuthUser } from '@/modules/auth/types'

interface AuthSlice {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
  setTermsAccepted: (termsAcceptedAt: string) => void
}

export const useAuthStore = create<AuthSlice>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    set({ accessToken: token, user, isAuthenticated: true })
  },

  clearAuth: () => {
    set({ accessToken: null, user: null, isAuthenticated: false })
  },

  setTermsAccepted: (termsAcceptedAt) => {
    set((state) => ({
      user: state.user ? { ...state.user, termsAcceptedAt } : null,
    }))
  },
}))

// Wire up the api.client token getter to the auth store
setTokenGetter(() => useAuthStore.getState().accessToken)
