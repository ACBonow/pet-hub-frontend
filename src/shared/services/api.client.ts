/**
 * @module shared
 * @file api.client.ts
 * @description Axios instance with request/response interceptors.
 * - Injects Authorization header from tokenGetter when set.
 * - Automatically refreshes expired access tokens on 401 responses.
 * - Normalizes error responses into ApiError.
 * - Base URL is configured via setApiBaseUrl (called in main.tsx from import.meta.env).
 */

import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/shared/types'

// --- Token provider (set by auth store after login) ---
let tokenGetter: () => string | null = () => null

export function setTokenGetter(fn: () => string | null): void {
  tokenGetter = fn
}

// --- Refresh token handlers (set by App on mount) ---
const REFRESH_TOKEN_STORAGE_KEY = 'pethub_refresh_token'

type RefreshFn = (refreshToken: string) => Promise<{ accessToken: string; refreshToken: string }>
type OnRefreshedFn = (accessToken: string, newRefreshToken: string) => void
type OnExpiredFn = () => void

let refreshFn: RefreshFn | null = null
let onRefreshedFn: OnRefreshedFn | null = null
let onExpiredFn: OnExpiredFn | null = null

export function setRefreshHandlers(
  refresh: RefreshFn,
  onRefreshed: OnRefreshedFn,
  onExpired: OnExpiredFn,
): void {
  refreshFn = refresh
  onRefreshedFn = onRefreshed
  onExpiredFn = onExpired
}

export function clearRefreshHandlers(): void {
  refreshFn = null
  onRefreshedFn = null
  onExpiredFn = null
}

// Injectable retry function — overridden in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let retryRequestFn: (config: any) => Promise<any> = (config) => api(config)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setRetryRequest(fn: (config: any) => Promise<any>): void {
  retryRequestFn = fn
}

// Reset to the default (api instance) — used in tests
export function resetRetryRequest(): void {
  retryRequestFn = (config) => api(config)
}

// --- Axios instance ---
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

export function setApiBaseUrl(url: string): void {
  api.defaults.baseURL = url
}

// --- Request interceptor (exported for unit testing) ---
export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = tokenGetter()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

// --- Response error interceptor (exported for unit testing) ---
export function responseErrorInterceptor(error: unknown): Promise<never> {
  // Canceled requests (AbortController.abort()) must be swallowed silently by callers.
  if (axios.isCancel(error)) {
    const apiError: ApiError = { code: 'REQUEST_CANCELED', message: 'canceled' }
    return Promise.reject(apiError)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any

  if (!err.response) {
    // Network error — no response from server
    const apiError: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Sem conexão com o servidor.',
    }
    return Promise.reject(apiError)
  }

  const data = err.response?.data
  const status: number = err.response?.status ?? 0

  const apiError: ApiError = {
    code: data?.error?.code ?? 'UNKNOWN_ERROR',
    message: data?.error?.message ?? 'Erro inesperado. Tente novamente.',
    status,
  }

  return Promise.reject(apiError)
}

api.interceptors.request.use(requestInterceptor)

// 401 interceptor: try refresh → retry. Runs before the error normalizer.
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any

    if (err.response?.status === 401 && !err.config?._retry && refreshFn) {
      const storedToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

      if (storedToken) {
        try {
          err.config._retry = true
          const { accessToken, refreshToken } = await refreshFn(storedToken)
          onRefreshedFn?.(accessToken, refreshToken)
          err.config.headers['Authorization'] = `Bearer ${accessToken}`
          return retryRequestFn(err.config)
        } catch {
          onExpiredFn?.()
        }
      } else {
        onExpiredFn?.()
      }
    }

    return Promise.reject(error)
  },
)

// Error normalizer: converts Axios errors to ApiError shape.
api.interceptors.response.use((response) => response, responseErrorInterceptor)

export default api
