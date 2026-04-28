/**
 * @module auth
 * @file LoginPage.tsx
 * @description Login page — wraps LoginForm in a centered card layout.
 */

import { Link } from 'react-router-dom'
import LoginForm from '@/modules/auth/components/LoginForm'
import LogoMark from '@/shared/components/ui/LogoMark'
import { ROUTES } from '@/routes/routes.config'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-6">
        <div className="mb-6 text-center">
          <Link to={ROUTES.HOME} className="inline-block hover:opacity-80 transition-opacity">
            <LogoMark size={30} />
          </Link>
          <p className="text-sm text-gray-600 mt-1">Entre na sua conta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
