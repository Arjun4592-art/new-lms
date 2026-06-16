import CourseForm from '@/components/admin/CourseForm'

export default function NewCoursePage() {
  return (
    <div className='space-y-6'>
      <div>
        <p
          className='text-[11px] font-semibold uppercase tracking-widest mb-1'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          Admin · Courses
        </p>
        <h1
          className='font-serif text-[26px] font-medium'
          style={{ color: 'var(--color-text)' }}
        >
          Add New Course
        </h1>
      </div>
      <CourseForm />
    </div>
  )
}
