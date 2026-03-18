/**
 * @module shared
 * @file AppShell.tsx
 * @description Application shell that wraps all authenticated pages.
 * Includes the Header, page content, and BottomNav.
 */

import BottomNav from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {children}
      <BottomNav />
    </div>
  )
}
