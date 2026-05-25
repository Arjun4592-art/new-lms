import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import {
  ArrowRightIcon,
  ShieldIcon,
  SparkleIcon,
  HeartIcon,
} from '@/components/ui/Icons'

const CERTIFICATIONS = [
  'Puja Punnet Life by Design',
  'Coaching Mastery Certification',
  'Coaching Certification',
]

export default function AboutPreview() {
  return (
    <section className='py-20 px-4 bg-linear-to-br from-[#F9F5FF] to-[#FDF4FF]'>
      <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center'>
        {/* Visual side */}
        <div className='relative flex justify-center order-2 lg:order-1'>
          <div className='relative'>
            {/* Main circle */}
            <div className='w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-linear-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center shadow-2xl shadow-purple-300/40'>
              <div className='text-center text-white px-8'>
                <SparkleIcon
                  size={40}
                  className='mx-auto mb-3 text-purple-200'
                />
                <p className='font-serif text-[20px] font-bold'>Masuma</p>
                <p className='text-purple-200 text-[13px] mt-1'>
                  Life Transformational Coach
                </p>
              </div>
            </div>

            {/* Floating cards */}
            <div className='absolute -top-4 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-purple-100 max-w-40'>
              <ShieldIcon size={18} className='text-[#7C5CBF] mb-1' />
              <p className='text-[12px] font-bold text-[#2D1B5E]'>
                Certified Coach
              </p>
              <p className='text-[11px] text-[#8470A8]'>3+ certifications</p>
            </div>

            <div className='absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-purple-100 max-w-40'>
              <HeartIcon size={18} className='text-pink-400 mb-1' />
              <p className='text-[12px] font-bold text-[#2D1B5E]'>500+ Women</p>
              <p className='text-[11px] text-[#8470A8]'>Transformed</p>
            </div>

            {/* Decorative ring */}
            <div
              className='absolute inset-0 rounded-full border-2 border-dashed border-purple-200 scale-110 animate-spin'
              style={{ animationDuration: '20s' }}
            />
          </div>
        </div>

        {/* Content side */}
        <div className='order-1 lg:order-2'>
          <SectionHeading
            eyebrow='Meet Your Coach'
            title='Hi, I am Masuma'
            subtitle='Life Transformational Coach helping people heal their past, reclaim their worth, and rise into their power.'
          />

          <p className='text-[15.5px] text-[#6B5B8B] leading-relaxed mt-4 mb-6'>
            My journey began with my own experiences of emotional overwhelm,
            people-pleasing, and silent pressure to "hold everything together."
            Through deep inner work, healing, and learning, I transformed my
            pain into purpose — and now I help women do the same.
          </p>

          <p className='text-[15.5px] text-[#6B5B8B] leading-relaxed mb-8'>
            This isn't just coaching. It's a journey of emotional freedom,
            self-respect, and generational healing.
          </p>

          {/* Certifications */}
          <div className='bg-white rounded-2xl border border-purple-100 p-5 mb-8'>
            <p className='text-[12px] font-bold uppercase tracking-widest text-[#A67DD4] mb-3'>
              Certifications
            </p>
            <ul className='space-y-2'>
              {CERTIFICATIONS.map((cert) => (
                <li
                  key={cert}
                  className='flex items-center gap-2.5 text-[14px] text-[#4A3570]'
                >
                  <ShieldIcon size={14} className='text-[#7C5CBF] shrink-0' />
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href='/about'
            className='inline-flex items-center gap-2 text-[#7C5CBF] font-semibold text-[15px] hover:gap-3 transition-all no-underline'
          >
            Read my full story <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
