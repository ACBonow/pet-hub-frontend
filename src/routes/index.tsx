/**
 * @module routes
 * @file index.tsx
 * @description Application router configuration.
 */

import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes.config'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/modules/auth/pages/LoginPage'
import RegisterPage from '@/modules/auth/pages/RegisterPage'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ProfilePage = lazy(() => import('@/modules/person/pages/ProfilePage'))
const ServicesListPage = lazy(() => import('@/modules/services-directory/pages/ServicesListPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-[--color-primary] border-t-transparent rounded-full" />
    </div>
  )
}

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  {
    path: ROUTES.SERVICES.LIST,
    element: (
      <Suspense fallback={<PageLoader />}>
        <ServicesListPage />
      </Suspense>
    ),
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
])
