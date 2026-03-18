/**
 * @module shared
 * @file Card.tsx
 * @description Surface card container component.
 */

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-[--radius-lg] shadow-sm border border-gray-100 p-4',
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        className,
      ].join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
