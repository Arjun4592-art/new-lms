import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import {
  ClockIcon,
  PlayIcon,
  UsersIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'

export interface CourseData {
  id: string
  title: string
  description: string
  duration: string
  format: string
  students?: number
  price?: string
  originalPrice?: string
  badge?: string
  badgeVariant?: 'purple' | 'pink' | 'green' | 'gold'
  emoji: string
  color: string
  modules: number
  includes: string[]
}

export default function CourseCard({ course }: { course: CourseData }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className='group block bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300 no-underline'
    >
      {/* Header gradient */}
      <div
        className={`h-36 bg-linear-to-br ${course.color} flex items-center justify-center relative`}
      >
        <span className='text-[52px]'>{course.emoji}</span>
        {course.badge && (
          <div className='absolute top-3 right-3'>
            <Badge variant={course.badgeVariant ?? 'purple'}>
              {course.badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className='p-6'>
        <h3 className='font-serif text-[17px] font-bold text-[#2D1B5E] mb-2 group-hover:text-[#7C5CBF] transition-colors leading-snug'>
          {course.title}
        </h3>
        <p className='text-[13.5px] text-[#8470A8] leading-relaxed mb-4 line-clamp-3'>
          {course.description}
        </p>

        {/* Meta */}
        <div className='flex flex-wrap gap-x-4 gap-y-1.5 mb-4'>
          <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
            <ClockIcon size={13} className='text-[#A67DD4]' /> {course.duration}
          </div>
          <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
            <PlayIcon size={13} className='text-[#A67DD4]' /> {course.format}
          </div>
          {course.students && (
            <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
              <UsersIcon size={13} className='text-[#A67DD4]' />{' '}
              {course.students}+ enrolled
            </div>
          )}
        </div>

        {/* Includes */}
        <div className='flex flex-wrap gap-1.5 mb-5'>
          {course.includes.slice(0, 3).map((item) => (
            <span
              key={item}
              className='text-[11px] bg-[#F9F5FF] text-[#7C5CBF] border border-purple-100 px-2 py-0.5 rounded-full'
            >
              {item}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className='pt-4 border-t border-purple-50 flex items-center justify-between'>
          <div>
            {course.price ? (
              <>
                <p className='text-[18px] font-bold text-[#2D1B5E]'>
                  {course.price}
                </p>
                {course.originalPrice && (
                  <p className='text-[12px] text-[#8470A8] line-through'>
                    {course.originalPrice}
                  </p>
                )}
              </>
            ) : (
              <p className='text-[14px] font-semibold text-[#7C5CBF]'>
                Enquire for pricing
              </p>
            )}
          </div>
          <div className='flex items-center gap-1 text-[#7C5CBF] font-semibold text-[13px]'>
            Enroll{' '}
            <ArrowRightIcon
              size={15}
              className='group-hover:translate-x-1 transition-transform'
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
