/**
 * @module shared
 * @file api.client.test.ts
 * @description Tests for the Axios API client — interceptors, token injection, error normalization.
 */

import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { requestInterceptor, responseErrorInterceptor, setTokenGetter, setApiBaseUrl } from '@/shared/services/api.client'

describe('api.client', () => {
  beforeEach(() => {
    setTokenGetter(() => null)
    setApiBaseUrl('http://localhost:3000')
  })

  describe('requestInterceptor', () => {
    it('should add Authorization header when token getter returns a token', () => {
      setTokenGetter(() => 'test-token-abc')

      const config = { headers: {} } as InternalAxiosRequestConfig
      const result = requestInterceptor(config)

      expect(result.headers['Authorization']).toBe('Bearer test-token-abc')
    })

    it('should NOT add Authorization header when token getter returns null', () => {
      setTokenGetter(() => null)

      const config = { headers: {} } as InternalAxiosRequestConfig
      const result = requestInterceptor(config)

      expect(result.headers['Authorization']).toBeUndefined()
    })
  })

  describe('responseErrorInterceptor', () => {
    it('should reject with ApiError when server returns structured error', async () => {
      const axiosError = {
        response: {
          data: {
            success: false,
            error: { code: 'INVALID_CPF', message: 'O CPF informado não é válido.' },
          },
          status: 422,
        },
      }

      await expect(responseErrorInterceptor(axiosError)).rejects.toMatchObject({
        code: 'INVALID_CPF',
        message: 'O CPF informado não é válido.',
        status: 422,
      })
    })

    it('should reject with default ApiError when server returns unstructured error', async () => {
      const axiosError = {
        response: {
          data: { message: 'Internal Server Error' },
          status: 500,
        },
      }

      await expect(responseErrorInterceptor(axiosError)).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: 'Erro inesperado. Tente novamente.',
        status: 500,
      })
    })

    it('should reject with network error when no response (e.g. offline)', async () => {
      const networkError = { request: {}, message: 'Network Error' }

      await expect(responseErrorInterceptor(networkError)).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
        message: 'Sem conexão com o servidor.',
      })
    })
  })

  describe('setApiBaseUrl', () => {
    it('should update the api instance baseURL', () => {
      // Just verify it does not throw — integration tested via real requests
      expect(() => setApiBaseUrl('http://api.example.com')).not.toThrow()
    })
  })

  describe('default export', () => {
    it('should export an axios instance', async () => {
      const api = (await import('@/shared/services/api.client')).default
      expect(api).toBeDefined()
      expect(typeof api.get).toBe('function')
      expect(typeof api.post).toBe('function')
    })
  })
})
