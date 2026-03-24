/**
 * @module shared
 * @file ContactGate.tsx
 * @description Shows contact info to authenticated users.
 * Unauthenticated users see a "Fazer login" CTA that redirects back after auth.
 */

import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'

interface ContactGateProps {
  value: string | null
  href?: string
}

export default function ContactGate({ value, href }: ContactGateProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!value) return null

  if (isAuthenticated) {
    if (href) {
      return (
        <a href={href} className="text-[--color-primary] hover:underline text-sm">
          {value}
        </a>
      )
    }
    return <span className="text-sm text-gray-700">{value}</span>
  }

  const returnTo = encodeURIComponent(location.pathname + location.search)

  return (
    <Link
      to={`${ROUTES.LOGIN}?returnTo=${returnTo}`}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[--color-primary] hover:underline"
    >
      Ver contato — Fazer login
    </Link>
  )
}
