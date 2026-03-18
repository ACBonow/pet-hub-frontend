/**
 * @module shared
 * @file usePagination.ts
 * @description Pagination state hook.
 */

import { useState } from 'react'

interface UsePaginationResult {
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  reset: () => void
}

export function usePagination(total: number, pageSize = 20): UsePaginationResult {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const nextPage = () => {
    if (hasNext) setPage((p) => p + 1)
  }

  const prevPage = () => {
    if (hasPrev) setPage((p) => p - 1)
  }

  const goToPage = (target: number) => {
    setPage(Math.max(1, Math.min(target, totalPages)))
  }

  const reset = () => setPage(1)

  return { page, pageSize, totalPages, hasNext, hasPrev, nextPage, prevPage, goToPage, reset }
}
