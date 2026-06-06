import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-sm tracking-wide uppercase transition-all duration-200 cursor-pointer font-sans'

const variants = {
  primary:
    'bg-primary-mid text-[var(--color-bg)] hover:bg-primary-dark shadow-md shadow-[var(--color-surface-border)]/60',
  outline:
    'border border-primary-muted text-primary-mid hover:bg-surface hover:border-primary',
  secondary: 'bg-surface text-primary-dark hover:bg-surface-hover',
  ghost: 'text-primary-mid hover:bg-primary-light',
}

const sizes = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-5 py-2.5 text-[12px]',
  lg: 'px-7 py-3.5 text-[13px]',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  style,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={style}
    >
      {children}
    </button>
  )
}
