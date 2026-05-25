import Button from '@/components/ui/Button'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/Icons'

const WHAT_YOU_LEARN = [
  'Recognise emotional patterns',
  'Set boundaries without guilt',
  'Let go of past pain',
  'Build emotional resilience',
  'Choose yourself with confidence',
]

export default function CTASection() {
  return (
    <section className='py-20 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-linear-to-br from-[#7C5CBF] to-[#A67DD4] rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden'>
          {/* Decorative circles */}
          <div className='absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2' />
          <div className='absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3' />

          <div className='relative'>
            <SparkleIcon size={36} className='text-purple-200 mx-auto mb-5' />

            <h2 className='font-serif text-[32px] sm:text-[40px] font-bold text-white leading-tight mb-4'>
              You are One Decision Away
              <br />
              from a Different Life
            </h2>

            <p className='text-purple-100 text-[16px] sm:text-[17px] leading-relaxed mb-8 max-w-xl mx-auto'>
              Stop waiting to feel "ready." The women who transformed their
              lives started exactly where you are right now.
            </p>

            {/* What you'll learn */}
            <div className='flex flex-wrap justify-center gap-2 mb-10'>
              {WHAT_YOU_LEARN.map((item) => (
                <span
                  key={item}
                  className='inline-flex items-center gap-1.5 bg-white/20 text-white text-[13px] px-3 py-1.5 rounded-full border border-white/30'
                >
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  {item}
                </span>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Button
                href='/courses'
                size='lg'
                variant='secondary'
                className='w-full sm:w-auto'
              >
                Book a Free Exploration Call
                <ArrowRightIcon size={18} />
              </Button>
              <Button
                href='/courses'
                size='lg'
                variant='ghost'
                className='text-white hover:bg-white/10 w-full sm:w-auto'
              >
                Browse All Programs
              </Button>
            </div>

            <p className='mt-6 text-purple-200 text-[13px]'>
              🔒 Safe, judgment-free space · 100% confidential · Women only
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
