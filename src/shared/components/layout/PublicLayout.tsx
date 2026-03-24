/**
 * @module shared
 * @file PublicLayout.tsx
 * @description Layout wrapper for public pages (landing, listings, detail pages).
 * Desktop: TopNav. Mobile: BottomNav.
 */

import TopNav from './TopNav'
import BottomNav from './BottomNav'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
