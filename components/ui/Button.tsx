import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  target?: string
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white shadow-lg shadow-purple-200 hover:shadow-purple-300',
  secondary:
    'bg-[#F3EEFF] hover:bg-[#E8DEFF] text-[#7C5CBF] border border-[#D4BEFF]',
  outline:
    'bg-transparent hover:bg-[#F3EEFF] text-[#7C5CBF] border-2 border-[#7C5CBF]',
  ghost: 'bg-transparent hover:bg-[#F3EEFF] text-[#7C5CBF]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-[15px] rounded-xl',
  lg: 'px-8 py-4 text-[16px] rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  target,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <Link href={href} className={styles} target={target}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {children}
    </button>
  )
}
