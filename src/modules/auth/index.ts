/**
 * @module auth
 * @file index.ts
 * @description Public surface of the auth module.
 */

export { useAuth } from './hooks/useAuth'
export { useAuthStore } from './store/authSlice'
export * from './types'
export { default as LoginForm } from './components/LoginForm'
export { default as RegisterForm } from './components/RegisterForm'
export { default as LoginPage } from './pages/LoginPage'
export { default as RegisterPage } from './pages/RegisterPage'
export { default as CheckEmailPage } from './pages/CheckEmailPage'
export { default as VerifyEmailPage } from './pages/VerifyEmailPage'
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage'
export { default as ForgotPasswordSentPage } from './pages/ForgotPasswordSentPage'
export { default as ResetPasswordPage } from './pages/ResetPasswordPage'
