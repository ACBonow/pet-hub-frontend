/**
 * @module shared
 * @file cnpj.validator.test.ts
 * @description Tests for Brazilian CNPJ validation — mirrors backend test cases.
 */

import { validateCnpj, sanitizeCnpj } from '@/shared/validators/cnpj.validator'

describe('sanitizeCnpj', () => {
  it('should remove all non-digit characters', () => {
    expect(sanitizeCnpj('11.222.333/0001-81')).toBe('11222333000181')
  })

  it('should return digits-only string unchanged', () => {
    expect(sanitizeCnpj('11222333000181')).toBe('11222333000181')
  })

  it('should handle empty string', () => {
    expect(sanitizeCnpj('')).toBe('')
  })
})

describe('validateCnpj', () => {
  describe('valid CNPJs', () => {
    it('should return true for a valid CNPJ with formatting', () => {
      expect(validateCnpj('11.222.333/0001-81')).toBe(true)
    })

    it('should return true for a valid CNPJ without formatting', () => {
      expect(validateCnpj('11222333000181')).toBe(true)
    })
  })

  describe('invalid length', () => {
    it('should return false for CNPJ with less than 14 digits', () => {
      expect(validateCnpj('1234567890123')).toBe(false)
    })

    it('should return false for CNPJ with more than 14 digits', () => {
      expect(validateCnpj('123456789012345')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(validateCnpj('')).toBe(false)
    })
  })

  describe('known invalid CNPJs (all same digit)', () => {
    const allSameDigit = [
      '00000000000000', '11111111111111', '22222222222222', '33333333333333',
      '44444444444444', '55555555555555', '66666666666666', '77777777777777',
      '88888888888888', '99999999999999',
    ]

    it.each(allSameDigit)('should return false for %s (all same digit)', (cnpj) => {
      expect(validateCnpj(cnpj)).toBe(false)
    })
  })

  describe('invalid check digits', () => {
    it('should return false when first check digit is wrong', () => {
      expect(validateCnpj('11222333000191')).toBe(false)
    })

    it('should return false when second check digit is wrong', () => {
      expect(validateCnpj('11222333000182')).toBe(false)
    })

    it('should return false for completely wrong check digits', () => {
      expect(validateCnpj('12345678000100')).toBe(false)
    })
  })
})
