interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`px-4 py-6 lg:px-8 lg:py-7 pb-12 ${className}`}>
      {children}
    </main>
  )
}
