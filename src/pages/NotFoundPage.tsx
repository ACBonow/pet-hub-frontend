/**
 * @module pages
 * @file NotFoundPage.tsx
 * @description 404 Not Found page shown for unknown routes.
 */

import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { ROUTES } from '@/routes/routes.config'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <p className="text-7xl font-bold text-[--color-primary]">404</p>
        <p className="text-xl font-semibold text-gray-800">Página não encontrada</p>
        <p className="text-sm text-gray-500">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 bg-[--color-primary] text-white rounded-[--radius-md] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Voltar para o início
        </Link>
      </div>
    </PublicLayout>
  )
}
