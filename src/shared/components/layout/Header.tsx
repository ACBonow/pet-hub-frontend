/**
 * @module shared
 * @file Header.tsx
 * @description Top app header with title and optional back button.
 */

import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBack?: boolean
  action?: React.ReactNode
}

function BackIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export default function Header({ title, showBack = false, action }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center h-14 px-4 gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-gray-700"
            aria-label="Voltar"
          >
            <BackIcon />
          </button>
        )}
        <h1 className="flex-1 text-base font-semibold text-gray-900 truncate">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
