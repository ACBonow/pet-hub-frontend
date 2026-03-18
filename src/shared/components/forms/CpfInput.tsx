/**
 * @module shared
 * @file CpfInput.tsx
 * @description Controlled CPF input with mask and built-in validation via react-hook-form.
 * Stores raw digits in the form; displays the formatted mask.
 */

import { useController, type Control } from 'react-hook-form'
import { validateCpf, sanitizeCpf } from '@/shared/validators/cpf.validator'
import { applyCpfMask } from '@/shared/utils/mask'

interface CpfInputProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  label?: string
  className?: string
  required?: boolean
}

export default function CpfInput({ name, control, label, className = '', required = false }: CpfInputProps) {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
    rules: {
      validate: (v: string) => {
        if (!v) return true // optional by default; use required prop to enforce
        return validateCpf(v) || 'CPF inválido'
      },
      required: required ? 'CPF é obrigatório' : false,
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitizeCpf(e.target.value)
    onChange(raw) // store raw digits
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={applyCpfMask(value as string)}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="000.000.000-00"
        className={[
          'w-full min-h-[44px] px-3 py-2',
          'border rounded-[--radius-md] text-sm',
          'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
          error
            ? 'border-[--color-danger] focus:ring-[--color-danger]'
            : 'border-gray-300',
        ].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-[--color-danger]">
          {error.message}
        </p>
      )}
    </div>
  )
}
