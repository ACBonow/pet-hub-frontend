/**
 * @module auth
 * @file types/index.ts
 * @description TypeScript types for the auth module.
 */

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  cpf: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

export interface VerifyEmailData { token: string }
export interface ResendVerificationData { email: string }
export interface ForgotPasswordData { email: string }
export interface ResetPasswordData { token: string; newPassword: string }
