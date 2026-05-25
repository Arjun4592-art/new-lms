'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MenuIcon, BellIcon } from '@/components/ui/Icons'

function BellIconSVG() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9' />
      <path d='M13.73 21a2 2 0 01-3.46 0' />
    </svg>
  )
}

interface Props {
  userName?: string
}

export default function DashboardTopbar({ userName = 'Student' }: Props) {
  const [showProfile, setShowProfile] = useState(false)

  function openSidebar() {
    const fn = (window as Window & { __openDashSidebar?: () => void })
      .__openDashSidebar
    if (fn) fn()
  }

  return (
    <header className='h-14 bg-white border-b border-purple-100 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20'>
      {/* Left */}
      <div className='flex items-center gap-3'>
        <button
          onClick={openSidebar}
          className='lg:hidden w-8 h-8 flex items-center justify-center text-[#8470A8] hover:bg-[#F3EEFF] rounded-lg'
        >
          <MenuIcon size={18} />
        </button>
        <div className='hidden sm:block'>
          <p className='text-[14px] font-semibold text-[#2D1B5E]'>
            Welcome back, {userName.split(' ')[0]} 🌸
          </p>
          <p className='text-[11px] text-[#A67DD4]'>
            Continue your healing journey
          </p>
        </div>
      </div>

      {/* Right */}
      <div className='flex items-center gap-2'>
        {/* Notifications */}
        <button className='relative w-8 h-8 flex items-center justify-center text-[#8470A8] hover:bg-[#F3EEFF] rounded-lg transition-colors'>
          <BellIconSVG />
          <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-[#C084F5] rounded-full' />
        </button>

        {/* Profile */}
        <div className='relative'>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className='flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-[#F3EEFF] rounded-xl transition-colors'
          >
            <div className='w-7 h-7 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center text-white text-[11px] font-bold'>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className='hidden sm:block text-[13px] font-medium text-[#4A3570]'>
              {userName.split(' ')[0]}
            </span>
          </button>

          {showProfile && (
            <>
              <div
                className='fixed inset-0 z-10'
                onClick={() => setShowProfile(false)}
              />
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-purple-100 rounded-2xl shadow-lg overflow-hidden z-20'>
                <div className='px-4 py-3 border-b border-purple-50'>
                  <p className='text-[13px] font-semibold text-[#2D1B5E]'>
                    {userName}
                  </p>
                  <p className='text-[11px] text-[#A67DD4]'>Student</p>
                </div>
                <div className='py-1'>
                  {[
                    { label: 'My Profile', href: '/dashboard/profile' },
                    { label: 'My Courses', href: '/dashboard/my-courses' },
                    { label: 'Settings', href: '/dashboard/profile' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setShowProfile(false)}
                      className='block px-4 py-2 text-[13px] text-[#4A3570] hover:bg-[#F3EEFF] no-underline transition-colors'
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className='border-t border-purple-50 py-1'>
                  <Link
                    href='/'
                    className='block px-4 py-2 text-[13px] text-[#C084F5] hover:bg-[#F3EEFF] no-underline transition-colors'
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
