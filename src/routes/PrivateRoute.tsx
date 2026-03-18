import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from './routes.config'

interface PrivateRouteProps {
  isAuthenticated: boolean
}

export default function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <Outlet />
}
