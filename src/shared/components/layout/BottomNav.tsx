/**
 * @module shared
 * @file BottomNav.tsx
 * @description Mobile-only bottom navigation bar. Hidden on lg screens and above.
 * Auth-aware: shows public tabs when unauthenticated, private tabs when authenticated.
 */

import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function PawIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="8" r="2" strokeWidth={2} />
      <circle cx="17" cy="8" r="2" strokeWidth={2} />
      <circle cx="4" cy="13" r="1.5" strokeWidth={2} />
      <circle cx="20" cy="13" r="1.5" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16c-3 0-6 2-6 4s2 2 6 2 6 0 6-2-3-4-6-4z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18M3 5l9 4-9 4" />
    </svg>
  )
}

const publicTabs: NavItem[] = [
  { label: 'Início', to: ROUTES.HOME, icon: <HomeIcon /> },
  { label: 'Adoção', to: ROUTES.ADOPTION.LIST, icon: <HeartIcon /> },
  { label: 'Achados', to: ROUTES.LOST_FOUND.LIST, icon: <FlagIcon /> },
  { label: 'Serviços', to: ROUTES.SERVICES.LIST, icon: <SearchIcon /> },
  { label: 'Entrar', to: ROUTES.LOGIN, icon: <PersonIcon /> },
]

const privateTabs: NavItem[] = [
  { label: 'Início', to: ROUTES.HOME, icon: <HomeIcon /> },
  { label: 'Pets', to: ROUTES.PET.LIST, icon: <PawIcon /> },
  { label: 'Adoção', to: ROUTES.ADOPTION.LIST, icon: <HeartIcon /> },
  { label: 'Achados', to: ROUTES.LOST_FOUND.LIST, icon: <FlagIcon /> },
  { label: 'Perfil', to: ROUTES.PROFILE, icon: <PersonIcon /> },
]

export default function BottomNav() {
  const { isAuthenticated } = useAuthStore()
  const tabs = isAuthenticated ? privateTabs : publicTabs

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
      aria-label="Navegação principal"
    >
      <ul className="flex items-stretch h-16">
        {tabs.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center h-full gap-0.5 text-xs font-medium',
                  'transition-colors duration-150',
                  isActive ? 'text-[--color-primary]' : 'text-gray-500 hover:text-gray-900',
                ].join(' ')
              }
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
