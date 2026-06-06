import FadeIn from '@/components/landing/FadeIn'
import { Tag, PrimaryButton } from '@/components/landing/UI'

const details = [
  { icon: '📅', label: 'Schedule', value: 'Every Weekend' },
  { icon: '⏱️', label: 'Duration', value: '60 minutes per session' },
  { icon: '🌐', label: 'Language', value: 'Hindi / English' },
  { icon: '📍', label: 'Venue', value: 'Zoom (Private 1:1)' },
]

interface SessionDetailsSectionProps {
  onCTA: () => void
}

export default function SessionDetailsSection({
  onCTA,
}: SessionDetailsSectionProps) {
  return (
    <section className='bg-surface px-6 py-20 text-center'>
      <div className='max-w-[800px] mx-auto'>
        <FadeIn>
          <Tag>📅 Session Details</Tag>
          <h2 className='font-serif text-[clamp(26px,3.5vw,40px)] font-medium text-text mb-3'>
            How it works
          </h2>
          <p className='text-primary-muted font-sans text-[15px] mb-12'>
            Everything you need to know before you join
          </p>
        </FadeIn>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
          {details.map(({ icon, label, value }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <div className='flex items-center gap-5 bg-white border border-surface-border rounded-[16px] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(122,106,88,0.1)]'>
                <div
                  className='w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] flex-shrink-0'
                  style={{ background: '#e8dfd0', border: '1px solid #d8cebc' }}
                >
                  {icon}
                </div>
                <div>
                  <p className='text-[11px] text-primary-muted font-sans tracking-[0.12em] uppercase mb-1.5'>
                    {label}
                  </p>
                  <p className='text-[16px] font-semibold text-text font-sans'>
                    {value}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={320}>
          <PrimaryButton onClick={onCTA}>→ Reserve My Free Spot</PrimaryButton>
        </FadeIn>
      </div>
    </section>
  )
}
