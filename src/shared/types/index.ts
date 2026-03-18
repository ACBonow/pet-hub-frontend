/**
 * @module shared
 * @file types/index.ts
 * @description Global shared TypeScript types used across the frontend.
 */

export interface ApiResponse<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

export interface ApiError {
  code: string
  message: string
  status?: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
