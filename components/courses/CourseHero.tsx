import Badge from '@/components/ui/Badge'
import { ClockIcon, PlayIcon, UsersIcon } from '@/components/ui/Icons'
import { CourseData } from './CourseCard'

interface CourseHeroProps {
  course: CourseData
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section
      className='pt-24 pb-14 px-4 relative overflow-hidden'
      style={{
        background:
          'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-mid) 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className='absolute top-0 right-0 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none'
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
      <div
        className='absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none'
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />

      <div className='relative max-w-6xl mx-auto'>
        {/* Emoji + badge row */}
        <div className='flex items-center gap-3 mb-5'>
          <span className='text-[48px]'>{course.emoji}</span>
          {course.badge && (
            <Badge variant={course.badgeVariant ?? 'default'}>
              {course.badge}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1
          className='font-serif text-[36px] sm:text-[48px] lg:text-[54px] font-medium leading-tight mb-4 max-w-3xl'
          style={{ color: 'var(--color-primary-light)' }}
        >
          {course.title}
        </h1>

        {/* Description */}
        <p
          className='text-[16px] sm:text-[17px] leading-relaxed max-w-2xl mb-8 font-light'
          style={{ color: 'var(--color-primary-accent)' }}
        >
          {course.description}
        </p>

        {/* Meta row */}
        <div
          className='flex flex-wrap items-center gap-5 text-[14px]'
          style={{ color: 'var(--color-primary-accent)' }}
        >
          <div className='flex items-center gap-2'>
            <ClockIcon
              size={15}
              style={{ color: 'var(--color-primary-muted)' }}
            />
            {course.duration}
          </div>
          <div className='flex items-center gap-2'>
            <PlayIcon
              size={15}
              style={{ color: 'var(--color-primary-muted)' }}
            />
            {course.format}
          </div>
          {course.students && (
            <div className='flex items-center gap-2'>
              <UsersIcon
                size={15}
                style={{ color: 'var(--color-primary-muted)' }}
              />
              {course.students}+ enrolled
            </div>
          )}
          {/* Stars */}
          <div className='flex items-center gap-1.5'>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                width='13'
                height='13'
                viewBox='0 0 24 24'
                fill='var(--color-primary-muted)'
              >
                <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
              </svg>
            ))}
            <span className='ml-1'>5.0 rating</span>
          </div>
        </div>

        {/* Pills */}
        <div className='mt-8 flex flex-wrap gap-3'>
          <div
            className='rounded-full px-4 py-1.5 text-[13px] font-medium'
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--color-primary-accent)',
            }}
          >
            {course.modules} modules
          </div>
          {course.includes.map((item) => (
            <div
              key={item}
              className='rounded-full px-4 py-1.5 text-[13px] font-medium'
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--color-primary-accent)',
              }}
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
