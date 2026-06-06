interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p
          className='text-xs font-bold uppercase tracking-widest mb-2'
          style={{
            color: light
              ? 'var(--color-primary-muted)'
              : 'var(--color-primary)',
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className='font-serif text-[28px] sm:text-[34px] font-medium leading-tight mb-3'
        style={{
          color: light ? 'var(--color-primary-light)' : 'var(--color-text)',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className='text-[15.5px] leading-relaxed font-light'
          style={{
            color: light
              ? 'var(--color-primary-accent)'
              : 'var(--color-primary)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
