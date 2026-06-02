import ResourceForm from '@/components/admin/ResourceForm'

export default function NewResourcePage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Admin · Resources
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Add New Resource
        </h1>
      </div>
      <ResourceForm />
    </div>
  )
}
