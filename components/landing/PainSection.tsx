import FadeIn from '@/components/landing/FadeIn'
import { Tag, PrimaryButton } from '@/components/landing/UI'

const pains = [
  {
    icon: '🌙',
    title: 'Sleepless replays',
    desc: "You wake up tired of replaying what you said or didn't say",
  },
  {
    icon: '✋',
    title: "The yes you didn't mean",
    desc: 'You say yes when every part of you wants to say no',
  },
  {
    icon: '🤏',
    title: 'Shrinking yourself',
    desc: 'You shrink yourself to keep the peace',
  },
  {
    icon: '🏆',
    title: 'Achieved but empty',
    desc: "You've achieved things but still feel like you're not enough",
  },
]

interface PainSectionProps {
  onCTA: () => void
}

export default function PainSection({ onCTA }: PainSectionProps) {
  return (
    <section className='bg-[#faf8f4] px-6 py-20'>
      <div className='max-w-[900px] mx-auto text-center'>
        <FadeIn>
          <Tag>Does this sound familiar?</Tag>
        </FadeIn>

        <FadeIn delay={80}>
          <h2 className='font-serif text-[clamp(28px,4vw,40px)] font-medium text-text leading-snug mb-12'>
            If even one of these hits —{' '}
            <em className='text-primary not-italic italic'>
              this was made for you.
            </em>
          </h2>
        </FadeIn>

        {/* 2-col grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          {pains.map(({ icon, title, desc }, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className='group flex items-start gap-4 bg-white border border-surface-border rounded-xl px-5 py-5 text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default'>
                {/* left accent bar */}
                <div className='absolute left-0 top-0 bottom-0 w-[3px] bg-[#c8a87a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl' />
                <div
                  className='w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[18px]'
                  style={{ background: '#e8dfd0', border: '1px solid #d8cebc' }}
                >
                  {icon}
                </div>
                <div>
                  <p className='font-semibold text-[14px] text-text font-sans mb-1'>
                    {title}
                  </p>
                  <p className='text-[13px] text-primary-muted font-sans leading-[1.65]'>
                    {desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* 5th card — centered */}
        <FadeIn delay={320} className='flex justify-center mb-10'>
          <div className='group flex items-start gap-4 bg-white border border-surface-border rounded-xl px-5 py-5 text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default max-w-[440px] w-full'>
            <div className='absolute left-0 top-0 bottom-0 w-[3px] bg-[#c8a87a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl' />
            <div
              className='w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[18px]'
              style={{ background: '#e8dfd0', border: '1px solid #d8cebc' }}
            >
              🗝️
            </div>
            <div>
              <p className='font-semibold text-[14px] text-text font-sans mb-1'>
                Waiting for permission
              </p>
              <p className='text-[13px] text-primary-muted font-sans leading-[1.65]'>
                You're waiting for permission to finally choose yourself
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <PrimaryButton onClick={onCTA}>Reserve My Spot →</PrimaryButton>
        </FadeIn>
      </div>
    </section>
  )
}
