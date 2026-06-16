import SessionForm from '@/components/admin/SessionForm'

export default function NewSessionPage() {
  return (
    <div className='space-y-6 max-w-3xl mx-auto px-4 sm:px-6'>
      <div className='animate-[fadeInDown_0.4s_ease_both]'>
        <p className='text-[12px] text-primary-muted font-semibold uppercase tracking-widest mb-1'>
          Admin · Sessions
        </p>
        <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
          Add New Session
        </h1>
      </div>
      <div className='animate-[fadeInUp_0.4s_ease_both]'>
        <SessionForm />
      </div>
    </div>
  )
}
