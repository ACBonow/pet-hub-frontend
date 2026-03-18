/**
 * @module shared
 * @file api.client.ts
 * @description Axios instance with request/response interceptors.
 * - Injects Authorization header from tokenGetter when set.
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
api.interceptors.response.use((response) => response, responseErrorInterceptor)

export default api
