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
        <label htmlFor={id} className="text-sm font-medium text-body">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full min-h-[44px] px-3 py-2',
          'border rounded-xl text-sm bg-card text-body',
          'focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green',
          'placeholder:text-muted',
          error
            ? 'border-red focus:ring-red/40 focus:border-red'
            : 'border-line',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red">{error}</p>
      )}
    </div>
  )
}
