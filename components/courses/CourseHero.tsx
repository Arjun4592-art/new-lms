import Badge from '@/components/ui/Badge'
import { ClockIcon, PlayIcon, UsersIcon, StarIcon } from '@/components/ui/Icons'
import { CourseData } from './CourseCard'

interface CourseHeroProps {
  course: CourseData
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section
      className={`pt-24 pb-14 px-4 bg-gradient-to-br ${course.color} relative overflow-hidden`}
    >
      {/* Dark overlay */}
      <div className='absolute inset-0 bg-black/25' />

      {/* Decorative blobs */}
      <div className='absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2' />

      <div className='relative max-w-6xl mx-auto'>
        {/* Emoji + badge row */}
        <div className='flex items-center gap-3 mb-5'>
          <span className='text-[48px]'>{course.emoji}</span>
          {course.badge && (
            <Badge variant={course.badgeVariant ?? 'purple'}>
              {course.badge}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className='font-serif text-[36px] sm:text-[48px] lg:text-[54px] font-bold text-white leading-tight mb-4 max-w-3xl'>
          {course.title}
        </h1>

        {/* Description */}
        <p className='text-[16px] sm:text-[17px] text-white/80 leading-relaxed max-w-2xl mb-8'>
          {course.description}
        </p>

        {/* Meta row */}
        <div className='flex flex-wrap items-center gap-5 text-white/80 text-[14px]'>
          <div className='flex items-center gap-2'>
            <ClockIcon size={15} className='text-white/60' />
            {course.duration}
          </div>
          <div className='flex items-center gap-2'>
            <PlayIcon size={15} className='text-white/60' />
            {course.format}
          </div>
          {course.students && (
            <div className='flex items-center gap-2'>
              <UsersIcon size={15} className='text-white/60' />
              {course.students}+ enrolled
            </div>
          )}
          <div className='flex items-center gap-1.5'>
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
            <span className='ml-1'>5.0 rating</span>
          </div>
        </div>

        {/* Modules + price pill */}
        <div className='mt-8 flex flex-wrap gap-3'>
          <div className='bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-[13px] text-white font-medium'>
            {course.modules} modules
          </div>
          {course.includes.map((item) => (
            <div
              key={item}
              className='bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-[13px] text-white font-medium'
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
