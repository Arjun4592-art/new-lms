interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'green' | 'gold' | 'pink' | 'default'
  className?: string
}

const variants = {
  purple: 'bg-surface text-primary border border-primary-light',
  green: 'bg-green-50 text-green-700 border border-green-200',
  gold: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  pink: 'bg-pink-50 text-pink-700 border border-pink-200',
  default: 'bg-surface text-primary-muted border border-surface',
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
