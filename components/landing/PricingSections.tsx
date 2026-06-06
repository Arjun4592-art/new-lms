import FadeIn from '@/components/landing/FadeIn'
import { Tag, PrimaryButton } from '@/components/landing/UI'

const items = [
  { icon: '🎥', label: '4-Week 1:1 Coaching Program' },
  { icon: '🔍', label: 'Exploration Session' },
  { icon: '📊', label: 'Weekly Tracker' },
  { icon: '🎧', label: 'Healing Audio + Workbook' },
  { icon: '💬', label: 'WhatsApp Support (ongoing)' },
]

interface PricingSectionProps {
  onCTA: () => void
}

export default function PricingSection({ onCTA }: PricingSectionProps) {
  return (
    <section className='bg-surface px-6 py-20 text-center'>
      <div className='max-w-[640px] mx-auto'>
        <FadeIn>
          <Tag>🎁 The Offer</Tag>
          <h2 className='font-serif text-[clamp(26px,4vw,42px)] font-medium text-text mb-12'>
            Everything you get <em className='italic text-primary'>inside.</em>
          </h2>
        </FadeIn>

        <FadeIn delay={120}>
          <div className='bg-white border border-surface-border rounded-[20px] p-10 shadow-[0_20px_60px_rgba(122,106,88,0.1)]'>
            {items.map(({ icon, label }) => (
              <div
                key={label}
                className='flex items-center gap-3 py-4 border-b border-surface-border last:border-b-0'
              >
                <span className='text-[18px] w-7 flex-shrink-0'>{icon}</span>
                <span className='text-[14px] text-primary-mid font-sans'>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className='mt-7'>
            <PrimaryButton onClick={onCTA} className='text-[15px] px-14 py-5'>
              ♥ I want this for myself →
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
