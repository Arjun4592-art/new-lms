interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow && (
        <span className='inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-[#A67DD4] bg-[#F3EEFF] px-3 py-1 rounded-full mb-3'>
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-[32px] sm:text-[38px] lg:text-[44px] font-bold leading-tight mb-4 ${light ? 'text-white' : 'text-[#2D1B5E]'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-[16px] sm:text-[17px] leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-purple-100' : 'text-[#6B5B8B]'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
