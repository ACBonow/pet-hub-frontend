import Spinner from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-green text-white hover:opacity-90',
  secondary: 'bg-transparent border border-green text-green hover:bg-green-light',
  danger:    'bg-red text-white hover:opacity-90',
  ghost:     'bg-transparent hover:bg-soft text-body',
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
        'rounded-xl font-semibold text-sm',
        'transition-all duration-150',
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
