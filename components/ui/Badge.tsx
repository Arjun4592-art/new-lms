interface BadgeProps {
  children: React.ReactNode
  variant?: 'warm' | 'sage' | 'gold' | 'rose' | 'default'
  className?: string
}

const variants: Record<string, React.CSSProperties> = {
  warm: {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-primary-mid)',
    border: '1px solid var(--color-surface-border)',
  },
  sage: {
    backgroundColor: '#EAF0E6',
    color: '#4A6741',
    border: '1px solid #C8D8C4',
  },
  gold: {
    backgroundColor: '#F5EDDA',
    color: '#7A5C20',
    border: '1px solid #E8D5B0',
  },
  rose: {
    backgroundColor: '#F5EAE8',
    color: '#7A4040',
    border: '1px solid #E8CECC',
  },
  default: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-surface)',
  },
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold tracking-wide uppercase ${className}`}
      style={variants[variant]}
    >
      {children}
    </span>
  )
}
