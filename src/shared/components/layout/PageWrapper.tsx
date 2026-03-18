/**
 * @module shared
 * @file PageWrapper.tsx
 * @description Wraps page content with safe-area padding for BottomNav.
 */

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`px-4 pt-4 pb-24 lg:pb-4 max-w-2xl mx-auto w-full ${className}`}>
      {children}
    </main>
  )
}
