import Button from '@/components/ui/Button'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/Icons'

export default function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
      {/* Blobs */}
      {/* <div className='absolute top-20 left-10 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-surface-hover/20 rounded-full blur-3xl pointer-events-none' /> */}

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center'>
        <div>
          {/* Eyebrow */}
          <div className='inline-flex items-center gap-2 bg-white border border-surface-border rounded-full px-4 py-1.5 mb-6 shadow-sm'>
            <SparkleIcon size={14} className='text-primary-accent' />
            <span className='text-[12.5px] font-semibold text-primary tracking-wide'>
              Transformational Life Coaching
            </span> 
          </div>

          {/* Headline */}
          <h1 className='font-serif text-[44px] sm:text-[52px] lg:text-[60px] font-bold leading-[1.1] text-primary-dark mb-6'>
            Turn Your{' '}
            <span className='relative inline-block'>
              <span className='relative z-10 text-primary'>Pain</span>
              <svg
                className='absolute -bottom-1 left-0 w-full'
                viewBox='0 0 200 12'
                fill='none'
              >
                <path
                  d='M2 9 Q100 2 198 9'
                  stroke='#D4BEFF'
                  strokeWidth='4'
                  strokeLinecap='round'
                />
              </svg>
            </span>{' '}
            Into{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-light'>
              Power.
            </span>
          </h1>

          <p className='text-[17px] sm:text-[18px] text-primary-mid leading-relaxed mb-4'>
            Heal, Grow, and Step Into the Strongest Version Of You.
          </p>
          <p className='text-[15.5px] text-primary-muted leading-relaxed mb-10 max-w-lg'>
            A safe, supportive space for women to release emotional pain, set
            healthy boundaries, and create a life rooted in confidence, clarity,
            and self-worth.
          </p>

          <div className='flex flex-wrap gap-4'>
            <Button
              href='/courses'
              size='lg'
              className='shadow-xl shadow-purple-200'
            >
              Book a Free Exploration Call
              <ArrowRightIcon size={18} />
            </Button>
            <Button href='/courses' variant='outline' size='lg'>
              Explore Programs
            </Button>
          </div>

          {/* Social proof */}
          <div className='mt-10 flex items-center gap-6'>
            <div className='flex -space-x-2'>
              {['S', 'P', 'R', 'M', 'A'].map((l, i) => (
                <div
                  key={i}
                  className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold bg-primary'
                  style={{ opacity: 0.7 + i * 0.06 }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className='text-[13.5px] font-semibold text-primary-dark'>
                500+ women transformed
              </p>
              <div className='flex items-center gap-0.5 mt-0.5'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width='13'
                    height='13'
                    viewBox='0 0 24 24'
                    fill='#F5A623'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                ))}
                <span className='text-[12px] text-primary-muted ml-1'>
                  5.0 rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className='relative flex justify-center'>
          <div className='relative w-full max-w-105'>
            <div className='bg-white rounded-3xl shadow-2xl shadow-purple-200/60 p-8 border border-surface-border'>
              <div className='w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary-light flex items-center justify-center mb-5 mx-auto'>
                <SparkleIcon size={28} className='text-white' />
              </div>
              <h3 className='font-serif text-[22px] font-bold text-primary-dark text-center mb-2'>
                Your Transformation Awaits
              </h3>
              <p className='text-[14px] text-primary-muted text-center mb-6 leading-relaxed'>
                Join hundreds of women who have already reclaimed their
                confidence and inner strength.
              </p>
              <div className='space-y-3'>
                {[
                  'Release emotional pain & past wounds',
                  'Set boundaries without fear or guilt',
                  'Build unshakeable self-worth',
                  'Step into your most powerful self',
                ].map((item) => (
                  <div key={item} className='flex items-center gap-3'>
                    <div className='w-5 h-5 rounded-full bg-surface flex items-center justify-center shrink-0'>
                      <svg
                        width='10'
                        height='10'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-primary'
                      >
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    </div>
                    <span className='text-[14px] text-primary-mid'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
