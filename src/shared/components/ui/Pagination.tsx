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
        className="min-h-[44px] px-4 py-2 text-sm font-semibold text-green border border-green rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green hover:text-white transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-muted">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="min-h-[44px] px-4 py-2 text-sm font-semibold text-green border border-green rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green hover:text-white transition-colors"
      >
        Próxima
      </button>
    </div>
  )
}
