interface LogoMarkProps {
  size?: number
  className?: string
}

export default function LogoMark({ size = 18, className = '' }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-[3px] font-fraunces font-black leading-none tracking-tight ${className}`}
      style={{ fontSize: size }}
    >
      <span className="text-green">Tchê</span>
      <span className="text-yellow-dark" style={{ fontSize: size * 0.72 }}>Pet</span>
      <span className="text-red" style={{ fontSize: size * 0.72 }}>Hub</span>
    </span>
  )
}
