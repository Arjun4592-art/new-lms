'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SparkleIcon,
  BookIcon,
  HeartIcon,
  DownloadIcon,
  MenuIcon,
  CloseIcon,
  CalendarIcon,
  PlayIcon,
} from '@/components/ui/Icons'

const NAV = [
  {
    label: 'My Dashboard',
    href: '/dashboard',
    icon: <SparkleIcon size={16} />,
  },
  {
    label: 'My Courses',
    href: '/dashboard/my-courses',
    icon: <BookIcon size={16} />,
  },
  {
    label: 'Live Sessions',
    href: '/dashboard/sessions',
    icon: <CalendarIcon size={16} />,
  },
  {
    label: 'Recordings',
    href: '/dashboard/recordings',
    icon: <PlayIcon size={16} />,
  },
  {
    label: 'Resources',
    href: '/dashboard/resources',
    icon: <DownloadIcon size={16} />,
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: <HeartIcon size={16} />,
  },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .dash-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
          color: var(--color-primary-mid);
        }
        .dash-nav-link:hover {
          background-color: var(--color-surface);
          color: var(--color-primary);
        }
        .dash-nav-link.active {
          background-color: var(--color-primary);
          color: var(--color-bg);
          box-shadow: 0 2px 10px rgba(122,106,88,0.22);
        }
        .dash-nav-link.active .dash-nav-icon { color: var(--color-bg); }
        .dash-nav-link:not(.active) .dash-nav-icon { color: var(--color-primary-muted); }

        .dash-support-card {
          background-color: var(--color-surface);
          border-radius: 10px; padding: 14px; margin-bottom: 10px;
        }
        .dash-contact-btn {
          display: block; text-align: center;
          font-size: 12px; font-weight: 600;
          color: var(--color-primary);
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 8px; padding: 6px;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .dash-contact-btn:hover { background-color: var(--color-surface); }

        .dash-back-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; text-decoration: none;
          color: var(--color-primary-muted);
          padding: 4px 8px; border-radius: 6px;
          transition: color 0.2s, background-color 0.2s;
        }
        .dash-back-link:hover {
          color: var(--color-primary);
          background-color: var(--color-surface);
        }
      `}</style>

      {/* Logo */}
      <div
        className='flex items-center gap-3 px-4 py-4'
        style={{ borderBottom: '1px solid var(--color-surface-border)' }}
      >
        <div
          className='w-9 h-9 rounded-full flex items-center justify-center shrink-0'
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <span
            className='text-[11px] font-bold'
            style={{ color: 'var(--color-bg)' }}
          >
            P2P
          </span>
        </div>
        <div>
          <p
            className='font-serif text-[14px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            Pain to Power
          </p>
          <p
            className='text-[10px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Student Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 space-y-0.5 overflow-y-auto'>
        {NAV.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`dash-nav-link ${active ? 'active' : ''}`}
            >
              <span className='dash-nav-icon'>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className='px-3 py-4'
        style={{ borderTop: '1px solid var(--color-surface-border)' }}
      >
        <div className='dash-support-card'>
          <p
            className='text-[12px] font-semibold mb-1'
            style={{ color: 'var(--color-text)' }}
          >
            Need Support?
          </p>
          <p
            className='text-[11px] mb-3'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Reach out to Masuma directly.
          </p>
          <Link
            href='/contact'
            onClick={onLinkClick}
            className='dash-contact-btn'
          >
            Contact Coach
          </Link>
        </div>
        <Link href='/' onClick={onLinkClick} className='dash-back-link'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
            <polyline points='9 22 9 12 15 12 15 22' />
          </svg>
          Back to Website
        </Link>
      </div>
    </>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    ;(window as any).__openDashSidebar = () => setMobileOpen(true)
    return () => {
      delete (window as any).__openDashSidebar
    }
  }, [])

  const sidebarBase = 'flex flex-col h-full'
  const sidebarStyle = {
    backgroundColor: 'var(--color-bg)',
    borderRight: '1px solid var(--color-surface-border)',
  }

  return (
    <>
      <style>{`
        .dash-sidebar-mobile {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dash-overlay {
          animation: overlayIn 0.2s ease forwards;
        }
        @keyframes overlayIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>

      {/* Desktop */}
      <aside
        className='hidden lg:flex w-56 h-screen flex-col shrink-0 fixed top-0 left-0 z-30'
        style={sidebarStyle}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='dash-overlay fixed inset-0 z-40 lg:hidden'
          style={{
            backgroundColor: 'rgba(44,34,24,0.4)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`dash-sidebar-mobile fixed top-0 left-0 h-full w-60 z-50 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={sidebarStyle}
      >
        <div className='flex items-center justify-end px-4 pt-3'>
          <button
            onClick={() => setMobileOpen(false)}
            className='w-8 h-8 flex items-center justify-center rounded-lg transition-colors'
            style={{ color: 'var(--color-primary-muted)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
