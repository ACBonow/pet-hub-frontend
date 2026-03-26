/**
 * @module shared
 * @file AppShell.tsx
 * @description Application shell that wraps all authenticated pages.
 * Desktop: TopNav at top. Mobile: BottomNav at bottom.
 */

import TopNav from './TopNav'
import BottomNav from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />
      {children}
      <BottomNav />
    </div>
  )
}
