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
  badgeVariant?: 'warm' | 'sage' | 'gold' | 'rose' | 'default'
  emoji: string
  color: string
  modules: number
  includes: string[]
}

export default function CourseCard({ course }: { course: CourseData }) {
  return (
    <>
      <style>{`
        .course-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px;
          overflow: hidden;
          display: block;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(44,34,24,0.12);
        }
        .course-card:hover .course-card-title {
          color: var(--color-primary);
        }
        .course-card:hover .course-card-arrow {
          transform: translateX(4px);
        }
        .course-card-title {
          color: var(--color-text);
          transition: color 0.2s ease;
        }
        .course-card-arrow {
          transition: transform 0.2s ease;
        }
        .course-include-tag {
          font-size: 11px;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
          padding: 2px 8px;
          border-radius: 9999px;
        }
      `}</style>

      <Link href={`/courses/${course.id}`} className='course-card group'>
        {/* Header gradient */}
        <div
          className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}
        >
          <span className='text-[52px]'>{course.emoji}</span>
          {course.badge && (
            <div className='absolute top-3 right-3'>
              <Badge variant={course.badgeVariant ?? 'default'}>
                {course.badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Body */}
        <div className='p-6'>
          <h3 className='course-card-title font-serif text-[17px] font-medium mb-2 leading-snug'>
            {course.title}
          </h3>
          <p
            className='text-[13.5px] leading-relaxed mb-4 line-clamp-3 font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            {course.description}
          </p>

          {/* Meta */}
          <div className='flex flex-wrap gap-x-4 gap-y-1.5 mb-4'>
            <div
              className='flex items-center gap-1.5 text-[12.5px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              <ClockIcon size={13} style={{ color: 'var(--color-primary)' }} />
              {course.duration}
            </div>
            <div
              className='flex items-center gap-1.5 text-[12.5px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              <PlayIcon size={13} style={{ color: 'var(--color-primary)' }} />
              {course.format}
            </div>
            {course.students && (
              <div
                className='flex items-center gap-1.5 text-[12.5px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                <UsersIcon
                  size={13}
                  style={{ color: 'var(--color-primary)' }}
                />
                {course.students}+ enrolled
              </div>
            )}
          </div>

          {/* Includes */}
          <div className='flex flex-wrap gap-1.5 mb-5'>
            {course.includes.slice(0, 3).map((item) => (
              <span key={item} className='course-include-tag'>
                {item}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div
            className='pt-4 flex items-center justify-between'
            style={{ borderTop: '1px solid var(--color-surface)' }}
          >
            <div>
              {course.price ? (
                <>
                  <p
                    className='text-[18px] font-semibold'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {course.price}
                  </p>
                  {course.originalPrice && (
                    <p
                      className='text-[12px] line-through'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {course.originalPrice}
                    </p>
                  )}
                </>
              ) : (
                <p
                  className='text-[14px] font-semibold'
                  style={{ color: 'var(--color-primary)' }}
                >
                  Enquire for pricing
                </p>
              )}
            </div>
            <div
              className='flex items-center gap-1 text-[13px] font-semibold'
              style={{ color: 'var(--color-primary)' }}
            >
              Enroll
              <ArrowRightIcon size={15} className='course-card-arrow' />
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
