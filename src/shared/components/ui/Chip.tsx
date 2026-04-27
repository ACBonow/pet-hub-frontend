import type { CSSProperties } from 'react'

type ChipVariant = 'solid' | 'outline'

interface ChipProps {
  children: React.ReactNode
  color?: string
  variant?: ChipVariant
  className?: string
  style?: CSSProperties
}

export default function Chip({
  children,
  color = 'var(--green)',
  variant = 'solid',
  className = '',
  style = {},
}: ChipProps) {
  const solidStyle: CSSProperties = {
    background: color,
    color: '#fff',
  }

  const outlineStyle: CSSProperties = {
    background: 'transparent',
    color,
    border: `1px solid ${color}55`,
  }

  return (
    <span
      style={{ ...(variant === 'solid' ? solidStyle : outlineStyle), ...style }}
      className={[
        'inline-flex items-center gap-1',
        'text-[11px] font-semibold tracking-[0.2px]',
        'px-[9px] py-1 rounded-full whitespace-nowrap',
        variant === 'outline' ? '' : 'border border-transparent',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
