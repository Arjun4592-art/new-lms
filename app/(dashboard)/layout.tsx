'use client'

import { useAuth } from '@/context/AuthContext'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardTopbar from '@/components/dashboard/DashboardTopbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, user } = useAuth()

  if (loading || !user) {
    return (
      <div className='min-h-screen bg-[#FAF8FF] flex items-center justify-center'>
        <div className='w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin' />
      </div>
    )
  }

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
