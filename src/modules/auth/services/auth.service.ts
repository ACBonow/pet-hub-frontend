/**
 * @module auth
 * @file auth.service.ts
 * @description API calls for authentication endpoints.
 */

import api from '@/shared/services/api.client'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/modules/auth/types'

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<{ success: true; data: AuthResponse }>('/api/v1/auth/login', credentials)
  return response.data.data
}

export async function registerRequest(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<{ success: true; data: AuthResponse }>('/api/v1/auth/register', data)
  return response.data.data
}

export async function refreshTokenRequest(): Promise<{ accessToken: string }> {
  const response = await api.post<{ success: true; data: { accessToken: string } }>('/api/v1/auth/refresh')
  return response.data.data
}

export async function logoutRequest(): Promise<void> {
  await api.post('/api/v1/auth/logout')
}

export async function verifyEmailRequest(data: VerifyEmailData): Promise<void> {
  await api.post('/api/v1/auth/verify-email', data)
}

export async function resendVerificationRequest(data: ResendVerificationData): Promise<void> {
  await api.post('/api/v1/auth/resend-verification', data)
}

export async function forgotPasswordRequest(data: ForgotPasswordData): Promise<void> {
  await api.post('/api/v1/auth/forgot-password', data)
}

export async function resetPasswordRequest(data: ResetPasswordData): Promise<void> {
  await api.post('/api/v1/auth/reset-password', data)
}
