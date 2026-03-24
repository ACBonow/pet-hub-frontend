/**
 * @module auth
 * @file useAuth.ts
 * @description Hook combining auth store state with auth service calls.
 */

import { useAuthStore } from '@/modules/auth/store/authSlice'
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  verifyEmailRequest,
  resendVerificationRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from '@/modules/auth/services/auth.service'
import type {
  LoginCredentials,
  RegisterData,
  AuthUser,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/modules/auth/types'

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

  async function verifyEmail(data: VerifyEmailData): Promise<void> {
    await verifyEmailRequest(data)
  }

  async function resendVerification(data: ResendVerificationData): Promise<void> {
    await resendVerificationRequest(data)
  }

  async function forgotPassword(data: ForgotPasswordData): Promise<void> {
    await forgotPasswordRequest(data)
  }

  async function resetPassword(data: ResetPasswordData): Promise<void> {
    await resetPasswordRequest(data)
  }

  return {
    accessToken,
    user: user as AuthUser | null,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  }
}
