import Button from '@/components/ui/Button'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/Icons'

export default function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] pt-16'>
      {/* Decorative blobs */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-[#D4BEFF]/30 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-[#F5C0D5]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#E8DEFF]/20 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center'>
        {/* Left content */}
        <div>
          {/* Eyebrow */}
          <div className='inline-flex items-center gap-2 bg-white border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm'>
            <SparkleIcon size={14} className='text-[#A67DD4]' />
            <span className='text-[12.5px] font-semibold text-[#7C5CBF] tracking-wide'>
              Transformational Life Coaching
            </span>
          </div>

          {/* Headline */}
          <h1 className='font-serif text-[44px] sm:text-[52px] lg:text-[60px] font-bold leading-[1.1] text-[#2D1B5E] mb-6'>
            Turn Your{' '}
            <span className='relative inline-block'>
              <span className='relative z-10 text-[#7C5CBF]'>Pain</span>
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
            <span className='text-transparent bg-clip-text bg-linear-to-r from-[#7C5CBF] to-[#C084F5]'>
              Power.
            </span>
          </h1>

          <p className='text-[17px] sm:text-[18px] text-[#6B5B8B] leading-relaxed mb-4'>
            Heal, Grow, and Step Into the Strongest Version Of You.
          </p>
          <p className='text-[15.5px] text-[#8470A8] leading-relaxed mb-10 max-w-lg'>
            A safe, supportive space for women to release emotional pain, set
            healthy boundaries, and create a life rooted in confidence, clarity,
            and self-worth — through guided coaching, courses, and
            transformational programs.
          </p>

          {/* CTAs */}
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
                  className='w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold'
                  style={{
                    background: [
                      '#7C5CBF',
                      '#A67DD4',
                      '#C084F5',
                      '#9B7EC8',
                      '#7C5CBF',
                    ][i],
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className='text-[13.5px] font-semibold text-[#2D1B5E]'>
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
                    className='shrink-0'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                ))}
                <span className='text-[12px] text-[#8470A8] ml-1'>
                  5.0 rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — visual card */}
        <div className='relative flex justify-center'>
          <div className='relative w-full max-w-105'>
            {/* Main card */}
            <div className='bg-white rounded-3xl shadow-2xl shadow-purple-200/60 p-8 border border-purple-100'>
              <div className='w-16 h-16 rounded-2xl bg-linear-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center mb-5 mx-auto'>
                <SparkleIcon size={28} className='text-white' />
              </div>
              <h3 className='font-serif text-[22px] font-bold text-[#2D1B5E] text-center mb-2'>
                Your Transformation Awaits
              </h3>
              <p className='text-[14px] text-[#8470A8] text-center mb-6 leading-relaxed'>
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
                    <div className='w-5 h-5 rounded-full bg-[#F3EEFF] flex items-center justify-center shrink-0'>
                      <svg
                        width='10'
                        height='10'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='#7C5CBF'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    </div>
                    <span className='text-[13.5px] text-[#4A3570]'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className='absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-purple-100'>
              <p className='text-[11px] text-[#8470A8]'>Next session</p>
              <p className='text-[13px] font-bold text-[#2D1B5E]'>
                Starting Soon 🌸
              </p>
            </div>
            <div className='absolute -bottom-4 -left-4 bg-[#7C5CBF] rounded-2xl shadow-lg px-4 py-2.5'>
              <p className='text-[11px] text-purple-200'>Community</p>
              <p className='text-[13px] font-bold text-white'>500+ women</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
