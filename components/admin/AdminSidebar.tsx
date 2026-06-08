'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import {
  LayoutDashboardIcon,
  BookIcon,
  UsersIcon,
  CalendarIcon,
  FileIcon,
  BarChartIcon,
  CreditCardIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/ui/Icons'

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboardIcon },
  { label: 'Courses', href: '/admin/courses', icon: BookIcon },
  { label: 'Students', href: '/admin/students', icon: UsersIcon },
  { label: 'Sessions', href: '/admin/sessions', icon: CalendarIcon },
  { label: 'Resources', href: '/admin/resources', icon: FileIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
  { label: 'Revenue', href: '/admin/revenue', icon: CreditCardIcon },
]

const sidebarStyle = {
  backgroundColor: 'var(--color-bg)',
  borderRight: '1px solid var(--color-surface-border)',
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuthContext()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch {
      setSigningOut(false)
    }
  }

  return (
    <>
      <style>{`
        .admin-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          text-decoration: none; transition: background-color 0.15s, color 0.15s;
          color: var(--color-primary-mid);
        }
        .admin-nav-link:hover {
          background-color: var(--color-surface);
          color: var(--color-primary);
        }
        .admin-nav-link.active {
          background-color: var(--color-surface);
          color: var(--color-primary);
          font-weight: 600;
        }
        .admin-nav-link .nav-icon { color: var(--color-primary-muted); }
        .admin-nav-link.active .nav-icon { color: var(--color-primary); }
        .admin-nav-link:hover .nav-icon { color: var(--color-primary); }

        .admin-signout-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          background: transparent; border: none; cursor: pointer;
          color: #EF4444; transition: background-color 0.15s, color 0.15s;
        }
        .admin-signout-btn:hover { background-color: #FEF2F2; color: #DC2626; }
        .admin-signout-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .admin-sidebar-overlay {
          animation: overlayIn 0.2s ease forwards;
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }

        .admin-sidebar-drawer {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Logo */}
      <div
        className='px-6 py-5'
        style={{ borderBottom: '1px solid var(--color-surface-border)' }}
      >
        <p
          className='font-serif text-[18px] font-medium'
          style={{ color: 'var(--color-text)' }}
        >
          Pain to Power
        </p>
        <span
          className='inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider'
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-surface-border)',
          }}
        >
          Admin Panel
        </span>
      </div>

      {/* Admin info */}
      <div
        className='px-4 py-3'
        style={{ borderBottom: '1px solid var(--color-surface-border)' }}
      >
        <div className='flex items-center gap-3'>
          <div
            className='w-8 h-8 rounded-full flex items-center justify-center shrink-0'
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
            }}
          >
            <span className='text-[11px] font-bold'>
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className='min-w-0'>
            <p
              className='text-[13px] font-semibold truncate'
              style={{ color: 'var(--color-text)' }}
            >
              {user?.name ?? 'Admin'}
            </p>
            <p
              className='text-[11px] truncate'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 space-y-0.5 overflow-y-auto'>
        {NAV.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className='nav-icon'>
                <item.icon size={17} />
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        className='px-3 py-4 space-y-0.5'
        style={{ borderTop: '1px solid var(--color-surface-border)' }}
      >
        <Link
          href='/dashboard'
          onClick={onLinkClick}
          className='admin-nav-link'
        >
          <span className='nav-icon'>
            <SettingsIcon size={17} />
          </span>
          Back to Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className='admin-signout-btn'
        >
          <svg
            width='17'
            height='17'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4' />
            <polyline points='16 17 21 12 16 7' />
            <line x1='21' y1='12' x2='9' y2='12' />
          </svg>
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </>
  )
}

export function AdminMenuButton() {
  return (
    <button
      onClick={() => (window as any).__openAdminSidebar?.()}
      className='lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors'
      style={{ color: 'var(--color-primary-muted)' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      <MenuIcon size={18} />
    </button>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    ;(window as any).__openAdminSidebar = () => setMobileOpen(true)
    return () => {
      delete (window as any).__openAdminSidebar
    }
  }, [])

  return (
    <>
      {/* Desktop */}
      <aside
        className='hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30'
        style={sidebarStyle}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='admin-sidebar-overlay fixed inset-0 z-40 lg:hidden'
          style={{
            backgroundColor: 'rgba(44,34,24,0.4)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`admin-sidebar-drawer fixed top-0 left-0 h-full w-64 flex flex-col z-50 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
