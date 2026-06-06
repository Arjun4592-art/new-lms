import CourseCard, { CourseData } from './CourseCard'

interface CourseGridProps {
  courses: CourseData[]
  columns?: 2 | 3 | 4
}

export default function CourseGrid({ courses, columns = 3 }: CourseGridProps) {
  const colClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  if (courses.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='text-[48px] mb-4'>🌿</div>
        <h3
          className='font-serif text-[20px] font-medium mb-2'
          style={{ color: 'var(--color-text)' }}
        >
          No courses found
        </h3>
        <p
          className='text-[14px] font-light'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          Check back soon — new programmes are being added.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6`}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
