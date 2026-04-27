import AppShell from './AppShell'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <AppShell>{children}</AppShell>
}
