/**
 * @module shared
 * @file Input.tsx
 * @description Shared text input component.
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full min-h-[44px] px-3 py-2',
          'border rounded-[--radius-md] text-sm',
          'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
          error
            ? 'border-[--color-danger] focus:ring-[--color-danger]'
            : 'border-gray-300',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[--color-danger]">
          {error}
        </p>
      )}
    </div>
  )
}
