/**
 * @module routes
 * @file PrivateRoute.tsx
 * @description Redirects unauthenticated users to /login.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from './routes.config'
import TermsBanner from '@/shared/components/ui/TermsBanner'

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.LOGIN}?returnTo=${returnTo}`} replace />
  }

  return (
    <>
      <TermsBanner />
      <Outlet />
    </>
  )
}
