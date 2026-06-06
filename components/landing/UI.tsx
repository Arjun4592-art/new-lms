// ── Tag ──────────────────────────────────────────────────────────────────────
interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-primary border border-surface-border rounded-full px-5 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase mb-5 font-sans ${className}`}
    >
      {children}
    </span>
  )
}

// ── PrimaryButton ─────────────────────────────────────────────────────────────
interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export function PrimaryButton({
  onClick,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${fullWidth ? 'w-full justify-center' : 'inline-flex'} items-center gap-2.5 bg-primary-dark text-[#faf8f4] border-none rounded-sm px-10 py-4 font-sans text-[13px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${className}`}
    >
      {children}
    </button>
  )
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider() {
  return <div className='h-px bg-surface-border' />
}
