/**
 * @module auth
 * @file auth.service.test.ts
 * @description Tests for auth service API calls — email verification and password recovery.
 */

import api from '@/shared/services/api.client'
import {
  verifyEmailRequest,
  resendVerificationRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from '@/modules/auth/services/auth.service'

jest.mock('@/shared/services/api.client')

const mockApi = api as jest.Mocked<typeof api>

describe('auth.service — email & password flows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('verifyEmailRequest', () => {
    it('should POST to /api/v1/auth/verify-email with the token', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await verifyEmailRequest({ token: 'abc123' })
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/auth/verify-email', { token: 'abc123' })
    })

    it('should resolve without errors on success', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await expect(verifyEmailRequest({ token: 'abc123' })).resolves.toBeUndefined()
    })

    it('should propagate error on failure', async () => {
      const error = { code: 'INVALID_VERIFICATION_TOKEN', message: 'Token inválido.' }
      mockApi.post.mockRejectedValueOnce(error)
      await expect(verifyEmailRequest({ token: 'bad-token' })).rejects.toMatchObject(error)
    })
  })

  describe('resendVerificationRequest', () => {
    it('should POST to /api/v1/auth/resend-verification with the email', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await resendVerificationRequest({ email: 'joao@example.com' })
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/auth/resend-verification', {
        email: 'joao@example.com',
      })
    })

    it('should resolve without errors on success', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await expect(
        resendVerificationRequest({ email: 'joao@example.com' }),
      ).resolves.toBeUndefined()
    })

    it('should propagate error on failure', async () => {
      const error = { code: 'SERVER_ERROR', message: 'Erro interno.' }
      mockApi.post.mockRejectedValueOnce(error)
      await expect(resendVerificationRequest({ email: 'x@x.com' })).rejects.toMatchObject(error)
    })
  })

  describe('forgotPasswordRequest', () => {
    it('should POST to /api/v1/auth/forgot-password with the email', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await forgotPasswordRequest({ email: 'joao@example.com' })
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/auth/forgot-password', {
        email: 'joao@example.com',
      })
    })

    it('should resolve without errors on success', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await expect(
        forgotPasswordRequest({ email: 'joao@example.com' }),
      ).resolves.toBeUndefined()
    })

    it('should propagate error on failure', async () => {
      const error = { code: 'SERVER_ERROR', message: 'Erro interno.' }
      mockApi.post.mockRejectedValueOnce(error)
      await expect(forgotPasswordRequest({ email: 'x@x.com' })).rejects.toMatchObject(error)
    })
  })

  describe('resetPasswordRequest', () => {
    it('should POST to /api/v1/auth/reset-password with token and newPassword', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await resetPasswordRequest({ token: 'tok123', newPassword: 'novaSenha@1' })
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/auth/reset-password', {
        token: 'tok123',
        newPassword: 'novaSenha@1',
      })
    })

    it('should resolve without errors on success', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { success: true } })
      await expect(
        resetPasswordRequest({ token: 'tok123', newPassword: 'novaSenha@1' }),
      ).resolves.toBeUndefined()
    })

    it('should propagate error on failure', async () => {
      const error = { code: 'RESET_TOKEN_EXPIRED', message: 'Link expirado.' }
      mockApi.post.mockRejectedValueOnce(error)
      await expect(
        resetPasswordRequest({ token: 'expired', newPassword: 'any' }),
      ).rejects.toMatchObject(error)
    })
  })
})
