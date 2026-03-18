/**
 * @module shared
 * @file cpf.validator.test.ts
 * @description Tests for Brazilian CPF validation — mirrors backend test cases.
 */

import { validateCpf, sanitizeCpf } from '@/shared/validators/cpf.validator'

describe('sanitizeCpf', () => {
  it('should remove all non-digit characters', () => {
    expect(sanitizeCpf('529.982.247-25')).toBe('52998224725')
  })

  it('should return digits-only string unchanged', () => {
    expect(sanitizeCpf('52998224725')).toBe('52998224725')
  })

  it('should handle empty string', () => {
    expect(sanitizeCpf('')).toBe('')
  })
})

describe('validateCpf', () => {
  describe('valid CPFs', () => {
    it('should return true for a valid CPF with formatting', () => {
      expect(validateCpf('529.982.247-25')).toBe(true)
    })

    it('should return true for a valid CPF without formatting', () => {
      expect(validateCpf('52998224725')).toBe(true)
    })
  })

  describe('invalid length', () => {
    it('should return false for CPF with less than 11 digits', () => {
      expect(validateCpf('1234567890')).toBe(false)
    })

    it('should return false for CPF with more than 11 digits', () => {
      expect(validateCpf('123456789012')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(validateCpf('')).toBe(false)
    })
  })

  describe('known invalid CPFs (all same digit)', () => {
    const allSameDigit = [
      '00000000000', '11111111111', '22222222222', '33333333333',
      '44444444444', '55555555555', '66666666666', '77777777777',
      '88888888888', '99999999999',
    ]

    it.each(allSameDigit)('should return false for %s (all same digit)', (cpf) => {
      expect(validateCpf(cpf)).toBe(false)
    })
  })

  describe('invalid check digits', () => {
    it('should return false when first check digit is wrong', () => {
      expect(validateCpf('52998224735')).toBe(false)
    })

    it('should return false when second check digit is wrong', () => {
      expect(validateCpf('52998224724')).toBe(false)
    })

    it('should return false for completely wrong check digits', () => {
      expect(validateCpf('12345678901')).toBe(false)
    })
  })
})
