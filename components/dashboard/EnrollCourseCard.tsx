import Link from 'next/link'
import ProgressBar from './ProgressBar'
import { PlayIcon, ClockIcon, CheckIcon } from '@/components/ui/Icons'
import type { Enrollment } from '@/types'

export interface EnrolledCourse {
  id: string
  title: string
  emoji: string
  color: string
  totalLessons: number
  nextLesson?: string
  format: string
}

export default function EnrolledCourseCard({
  course,
  enrollment,
}: {
  course: EnrolledCourse
  enrollment?: Enrollment
}) {
  const progress = enrollment?.progress ?? 0
  const completedLessons = enrollment?.completedLessons?.length ?? 0
  const isCompleted = progress === 100

  return (
    <>
      <style>{`
        .ecc-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ecc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(44,34,24,0.10);
        }
        .ecc-card:hover .ecc-title { color: var(--color-primary); }
        .ecc-title {
          color: var(--color-text);
          transition: color 0.2s;
        }
        .ecc-badge {
          position: absolute; top: 10px; right: 10px;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 10.5px; font-weight: 600;
          padding: 3px 9px; border-radius: 9999px;
          display: flex; align-items: center; gap: 4px;
        }
        .ecc-btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          text-decoration: none;
          background-color: var(--color-primary);
          color: var(--color-bg);
          transition: background-color 0.2s;
        }
        .ecc-btn-primary:hover { background-color: var(--color-primary-hover); }
        .ecc-btn-secondary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          text-decoration: none;
          background-color: var(--color-surface);
          color: var(--color-primary);
          transition: background-color 0.2s;
        }
        .ecc-btn-secondary:hover { background-color: var(--color-surface-hover); }
      `}</style>

      <div className='ecc-card group'>
        {/* Header */}
        <div
          className={`h-28 bg-linear-to-br ${course.color} flex items-center justify-center relative`}
        >
          <span className='text-[44px]'>{course.emoji}</span>
          {isCompleted && (
            <div className='ecc-badge'>
              <CheckIcon size={9} /> Completed
            </div>
          )}
        </div>

        {/* Body */}
        <div className='p-5'>
          <h3 className='ecc-title font-serif text-[15px] font-medium mb-1 leading-snug'>
            {course.title}
          </h3>

          <div
            className='flex items-center gap-3 text-[12px] mb-4'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            <div className='flex items-center gap-1'>
              <ClockIcon size={12} style={{ color: 'var(--color-primary)' }} />
              {course.format}
            </div>
            <span>·</span>
            <span>
              {completedLessons}/{course.totalLessons} lessons
            </span>
          </div>

          <ProgressBar value={progress} size='sm' />

          {course.nextLesson && !isCompleted && (
            <p
              className='text-[11.5px] mt-2 truncate'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Next:{' '}
              <span
                className='font-medium'
                style={{ color: 'var(--color-primary-mid)' }}
              >
                {course.nextLesson}
              </span>
            </p>
          )}

          <Link
            href={`/dashboard/learn/${course.id}`}
            className={`mt-4 ${isCompleted ? 'ecc-btn-secondary' : 'ecc-btn-primary'}`}
          >
            <PlayIcon size={13} />
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Link>
        </div>
      </div>
    </>
  )
}
