import SectionHeading from '@/components/ui/SectionHeading'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const PAIN_POINTS = [
  'Feeling emotionally overwhelmed and stuck',
  'People-pleasing and losing yourself',
  'Carrying guilt, shame & generational pressure',
  'Unable to set boundaries without fear',
  'Low self-worth and lack of confidence',
]

const TRANSFORMATIONS = [
  'Emotional freedom and inner peace',
  'Healthy boundaries with confidence',
  'Released past pain & generational wounds',
  'Unshakeable self-worth and clarity',
  'Stepping into your most powerful self',
]

export default function TransformationSection() {
  return (
    <section className='py-20 px-4 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <SectionHeading
          eyebrow='The Journey'
          title='From Pain to Power'
          subtitle='You deserve to move from where you are to where you are meant to be.'
          center
        />

        <div className='mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
          {/* Before */}
          <div className='bg-[#FFF8F9] border border-pink-100 rounded-2xl p-7'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center'>
                <span className='text-pink-500 text-[16px]'>💔</span>
              </div>
              <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E]'>
                Where You Are Now
              </h3>
            </div>
            <ul className='space-y-3'>
              {PAIN_POINTS.map((point) => (
                <li
                  key={point}
                  className='flex items-start gap-3 text-[14px] text-[#6B5B8B]'
                >
                  <span className='w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center shrink-0 mt-0.5'>
                    <svg
                      width='8'
                      height='8'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#C2557A'
                      strokeWidth='3'
                      strokeLinecap='round'
                    >
                      <line x1='18' y1='6' x2='6' y2='18' />
                      <line x1='6' y1='6' x2='18' y2='18' />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-7 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-[#D4BEFF]/20 rounded-full -translate-y-1/2 translate-x-1/2' />
            <div className='flex items-center gap-3 mb-5 relative'>
              <div className='w-8 h-8 rounded-full bg-[#F3EEFF] flex items-center justify-center'>
                <span className='text-[16px]'>✨</span>
              </div>
              <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E]'>
                Where You Are Going
              </h3>
            </div>
            <ul className='space-y-3 relative'>
              {TRANSFORMATIONS.map((item) => (
                <li
                  key={item}
                  className='flex items-start gap-3 text-[14px] text-[#4A3570]'
                >
                  <span className='w-5 h-5 rounded-full bg-[#7C5CBF] flex items-center justify-center shrink-0 mt-0.5'>
                    <CheckIcon size={10} className='text-white' />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Arrow connector */}
        <div className='flex justify-center mt-8'>
          <a
            href='/courses'
            className='inline-flex items-center gap-2 text-[#7C5CBF] font-semibold text-[15px] hover:gap-3 transition-all no-underline'
          >
            Start your journey today <ArrowRightIcon size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
