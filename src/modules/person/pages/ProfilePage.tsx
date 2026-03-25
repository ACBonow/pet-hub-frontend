/**
 * @module person
 * @file ProfilePage.tsx
 * @description Profile page for the current authenticated user.
 */

import { useNavigate } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import PersonProfile from '@/modules/person/components/PersonProfile'
import Button from '@/shared/components/ui/Button'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ROUTES } from '@/routes/routes.config'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <AppShell>
      <Header title="Meu Perfil" showBack />
      <PageWrapper>
        <PersonProfile />
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button variant="ghost" onClick={handleLogout} className="w-full text-red-500 hover:text-red-600">
            Sair da conta
          </Button>
        </div>
      </PageWrapper>
    </AppShell>
  )
}
