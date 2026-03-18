/**
 * @module shared
 * @file mask.ts
 * @description Input mask helpers for CPF and CNPJ display formatting.
 * The underlying form value is always raw digits — masks are display-only.
 */

/** Applies CPF mask: 000.000.000-00 */
export function applyCpfMask(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** Applies CNPJ mask: 00.000.000/0000-00 */
export function applyCnpjMask(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/** Strips all non-digit characters. Reexport of sanitize for convenience. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}
