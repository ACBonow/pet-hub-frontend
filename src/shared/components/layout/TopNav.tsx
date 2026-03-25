/**
 * @module shared
 * @file TopNav.tsx
 * @description Desktop-only top navigation bar. Hidden on mobile (lg:flex).
 * Shows public links + Entrar when unauthenticated, user name when authenticated.
 */

import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ROUTES } from '@/routes/routes.config'

const publicLinks = [
  { label: 'Adoção', to: ROUTES.ADOPTION.LIST },
  { label: 'Achados e Perdidos', to: ROUTES.LOST_FOUND.LIST },
  { label: 'Serviços', to: ROUTES.SERVICES.LIST },
]

export default function TopNav() {
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <header className="hidden lg:flex items-center h-16 px-8 bg-white border-b border-gray-200 gap-8 sticky top-0 z-30">
      <Link
        to={ROUTES.HOME}
        className="text-xl font-bold text-[--color-primary] shrink-0"
      >
        PetHUB
      </Link>

      <nav className="flex items-center gap-6 flex-1" aria-label="Navegação principal">
        {publicLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-[--color-primary]' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <Link
              to={ROUTES.PROFILE}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-500 text-white hover:opacity-90 transition-opacity"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
