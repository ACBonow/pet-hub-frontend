/**
 * @file HomePage.tsx
 * @description Home/dashboard page placeholder.
 */

import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'

export default function HomePage() {
  return (
    <AppShell>
      <Header title="PetHUB" />
      <PageWrapper>
        <p className="text-gray-600">Em breve: seus pets e muito mais.</p>
      </PageWrapper>
    </AppShell>
  )
}
