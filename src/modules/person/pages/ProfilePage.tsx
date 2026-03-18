/**
 * @module person
 * @file ProfilePage.tsx
 * @description Profile page for the current authenticated user.
 */

import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import PersonProfile from '@/modules/person/components/PersonProfile'
import { useAuthStore } from '@/modules/auth/store/authSlice'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <AppShell>
      <Header title="Meu Perfil" showBack />
      <PageWrapper>
        <PersonProfile personId={user.id} />
      </PageWrapper>
    </AppShell>
  )
}
