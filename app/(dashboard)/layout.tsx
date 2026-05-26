import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardTopbar from '@/components/dashboard/DashboardTopbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-[#FAF8FF] overflow-hidden'>
      <DashboardSidebar />
      <div className='flex flex-col flex-1 min-w-0 lg:ml-56'>
        <DashboardTopbar />
        <main className='flex-1 overflow-y-auto p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  )
}
