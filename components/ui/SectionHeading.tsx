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
  center = false,
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p
          className={`text-xs font-bold uppercase tracking-widest mb-2 ${
            light ? 'text-purple-200' : 'text-primary'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-[28px] sm:text-[34px] font-bold leading-tight mb-3 ${
          light ? 'text-white' : 'text-primary-dark'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-[15.5px] leading-relaxed max-w-xl ${
            light ? 'text-purple-100' : 'text-primary-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
