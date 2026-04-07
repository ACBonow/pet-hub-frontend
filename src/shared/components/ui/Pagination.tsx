/**
 * @module shared
 * @file Pagination.tsx
 * @description Shared pagination control component.
 */

interface PaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export default function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="min-h-[44px] px-4 py-2 text-sm font-medium text-[--color-primary] border border-[--color-primary] rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-primary] hover:text-white transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="min-h-[44px] px-4 py-2 text-sm font-medium text-[--color-primary] border border-[--color-primary] rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-primary] hover:text-white transition-colors"
      >
        Próxima
      </button>
    </div>
  )
}
