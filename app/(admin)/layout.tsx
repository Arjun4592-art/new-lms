import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-[#FAF8FF] overflow-hidden'>
      <AdminSidebar />
      <div className='flex flex-col flex-1 min-w-0 lg:ml-64'>
        <AdminTopbar />
        <main className='flex-1 overflow-y-auto p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  )
}
