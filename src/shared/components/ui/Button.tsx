/**
 * @module shared
 * @file Button.tsx
 * @description Shared button component with variants, loading and disabled states.
 */

import Spinner from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[--color-primary] hover:bg-[--color-primary-dark] text-white button-primary',
  secondary:
    'bg-transparent border border-[--color-primary] text-[--color-primary] hover:bg-blue-50 button-secondary',
  danger:
    'bg-[--color-danger] hover:opacity-90 text-white button-danger',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-700 button-ghost',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'min-h-[44px] min-w-[44px] px-4 py-2',
        'rounded-[--radius-md] font-medium text-sm',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Spinner size="sm" data-testid="button-spinner" />}
      {children}
    </button>
  )
}
