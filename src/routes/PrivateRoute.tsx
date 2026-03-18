/**
 * @module routes
 * @file PrivateRoute.tsx
 * @description Redirects unauthenticated users to /login.
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from './routes.config'

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
