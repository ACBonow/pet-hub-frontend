/**
 * @module routes
 * @file index.tsx
 * @description Application router configuration.
 *
 * PUBLIC  — accessible without authentication (PublicLayout).
 * AUTH    — login / register pages (no layout wrapper).
 * PRIVATE — requires authentication via PrivateRoute (AppShell).
 */

import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes.config'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/modules/auth/pages/LoginPage'
import RegisterPage from '@/modules/auth/pages/RegisterPage'
import CheckEmailPage from '@/modules/auth/pages/CheckEmailPage'
import VerifyEmailPage from '@/modules/auth/pages/VerifyEmailPage'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage'
import ForgotPasswordSentPage from '@/modules/auth/pages/ForgotPasswordSentPage'
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage'

// ── PUBLIC ────────────────────────────────────────────────────────────────────
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AdoptionListPage = lazy(() => import('@/modules/adoption/pages/AdoptionListPage'))
const AdoptionDetailPage = lazy(() => import('@/modules/adoption/pages/AdoptionDetailPage'))
const LostFoundListPage = lazy(() => import('@/modules/lost-found/pages/LostFoundListPage'))
const LostFoundDetailPage = lazy(() => import('@/modules/lost-found/pages/LostFoundDetailPage'))
const ServicesListPage = lazy(() => import('@/modules/services-directory/pages/ServicesListPage'))
const ServiceDetailPage = lazy(() => import('@/modules/services-directory/pages/ServiceDetailPage'))

// ── PRIVATE ───────────────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ServiceFormPage = lazy(() => import('@/modules/services-directory/pages/ServiceFormPage'))
const AdoptionFormPage = lazy(() => import('@/modules/adoption/pages/AdoptionFormPage'))
const LostFoundFormPage = lazy(() => import('@/modules/lost-found/pages/LostFoundFormPage'))
const PetListPage = lazy(() => import('@/modules/pet/pages/PetListPage'))
const PetFormPage = lazy(() => import('@/modules/pet/pages/PetFormPage'))
const PetEditPage = lazy(() => import('@/modules/pet/pages/PetEditPage'))
const PetDetailPage = lazy(() => import('@/modules/pet/pages/PetDetailPage'))
const PetHealthPage = lazy(() => import('@/modules/pet-health/pages/PetHealthPage'))
const OrganizationListPage = lazy(() => import('@/modules/organization/pages/OrganizationListPage'))
const OrganizationFormPage = lazy(() => import('@/modules/organization/pages/OrganizationFormPage'))
const OrganizationDetailPage = lazy(() => import('@/modules/organization/pages/OrganizationDetailPage'))
const OrganizationDashboardPage = lazy(() => import('@/modules/organization/pages/OrganizationDashboardPage'))
const ProfilePage = lazy(() => import('@/modules/person/pages/ProfilePage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-[--color-primary] border-t-transparent rounded-full" />
    </div>
  )
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  // ── AUTH ───────────────────────────────────────────────────────────────────
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.AUTH.CHECK_EMAIL, element: <CheckEmailPage /> },
  { path: ROUTES.AUTH.VERIFY_EMAIL, element: <VerifyEmailPage /> },
  { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.AUTH.FORGOT_PASSWORD_SENT, element: <ForgotPasswordSentPage /> },
  { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPasswordPage /> },

  // ── PUBLIC ─────────────────────────────────────────────────────────────────
  { path: ROUTES.HOME,               element: <S><LandingPage /></S> },
  { path: ROUTES.ADOPTION.LIST,      element: <S><AdoptionListPage /></S> },
  { path: ROUTES.ADOPTION.DETAIL(':id'), element: <S><AdoptionDetailPage /></S> },
  { path: ROUTES.LOST_FOUND.LIST,    element: <S><LostFoundListPage /></S> },
  { path: ROUTES.LOST_FOUND.DETAIL(':id'), element: <S><LostFoundDetailPage /></S> },
  { path: ROUTES.SERVICES.LIST,      element: <S><ServicesListPage /></S> },
  { path: ROUTES.SERVICES.DETAIL(':id'), element: <S><ServiceDetailPage /></S> },

  // ── PRIVATE ────────────────────────────────────────────────────────────────
  {
    element: <PrivateRoute />,
    children: [
      { path: ROUTES.DASHBOARD,                element: <S><DashboardPage /></S> },
      { path: ROUTES.ADOPTION.CREATE,          element: <S><AdoptionFormPage /></S> },
      { path: ROUTES.LOST_FOUND.CREATE,        element: <S><LostFoundFormPage /></S> },
      { path: ROUTES.PET.LIST,                 element: <S><PetListPage /></S> },
      { path: ROUTES.PET.CREATE,               element: <S><PetFormPage /></S> },
      { path: ROUTES.PET.EDIT(':id'),          element: <S><PetEditPage /></S> },
      { path: ROUTES.PET.DETAIL(':id'),        element: <S><PetDetailPage /></S> },
      { path: ROUTES.PET.HEALTH(':id'),        element: <S><PetHealthPage /></S> },
      { path: ROUTES.ORGANIZATION.LIST,        element: <S><OrganizationListPage /></S> },
      { path: ROUTES.ORGANIZATION.CREATE,      element: <S><OrganizationFormPage /></S> },
      { path: ROUTES.ORGANIZATION.DETAIL(':id'), element: <S><OrganizationDetailPage /></S> },
      { path: ROUTES.ORGANIZATION.EDIT(':id'), element: <S><OrganizationFormPage /></S> },
      { path: ROUTES.ORGANIZATION.DASHBOARD(':id'), element: <S><OrganizationDashboardPage /></S> },
      { path: ROUTES.SERVICES.CREATE,          element: <S><ServiceFormPage /></S> },
      { path: ROUTES.SERVICES.EDIT(':id'),     element: <S><ServiceFormPage /></S> },
      { path: ROUTES.PROFILE,                  element: <S><ProfilePage /></S> },
    ],
  },
])
