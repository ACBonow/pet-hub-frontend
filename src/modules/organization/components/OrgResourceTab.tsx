/**
 * @module organization
 * @file components/OrgResourceTab.tsx
 * @description Generic resource list tab for the organization dashboard.
 */

interface OrgResourceTabProps {
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  emptyMessage: string
  children: React.ReactNode
}

export default function OrgResourceTab({
  isLoading,
  error,
  isEmpty,
  emptyMessage,
  children,
}: OrgResourceTabProps) {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando...</p>
  }

  if (error) {
    return <p role="alert" className="text-sm text-[--color-danger]">{error}</p>
  }

  if (isEmpty) {
    return <p className="text-sm text-gray-400">{emptyMessage}</p>
  }

  return <div className="flex flex-col gap-2">{children}</div>
}
