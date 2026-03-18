/**
 * @module auth
 * @file LoginPage.tsx
 * @description Login page — wraps LoginForm in a centered card layout.
 */

import LoginForm from '@/modules/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">PetHUB</h1>
          <p className="text-sm text-gray-600 mt-1">Entre na sua conta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
