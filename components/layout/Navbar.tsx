'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import { MenuIcon, CloseIcon } from '@/components/ui/Icons'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading, logOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F4]/95 backdrop-blur-md shadow-sm shadow-[#E8DFD0]'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 no-underline'>
            <div className='w-9 h-9 rounded-full bg-[#5C4A38] border border-[#7A6A58] flex items-center justify-center'>
              <span className='text-[#FAF8F4] text-[12px] font-semibold tracking-wide'>
                P2P
              </span>
            </div>
            <div className='leading-none'>
              <p className='font-serif text-[15px] font-medium text-[#2C2218]'>
                Pain to Power
              </p>
              <p className='text-[10px] text-[#B8A898] tracking-widest uppercase'>
                Coaching
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center gap-1'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-sm text-[14px] font-medium transition-all no-underline tracking-wide ${
                  pathname === link.href
                    ? 'text-[#5C4A38] bg-[#E8DFD0]'
                    : 'text-[#7A6A58] hover:text-[#2C2218] hover:bg-[#F0EBE3]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className='hidden md:flex items-center gap-3'>
            <Button href='/login' variant='ghost' size='sm'>
              {user ? (
                user?.photoURL ? (
                  <>
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className='w-7 h-7 rounded-full object-cover border border-[#D8CEBC]'
                    />{' '}
                    {user.name}
                  </>
                ) : (
                  <>
                    <div className='w-7 h-7 rounded-full bg-[#E8DFD0] border border-[#D8CEBC] flex items-center justify-center text-[#5C4A38] text-[11px] font-semibold'>
                      {user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    {user.name}
                  </>
                )
              ) : (
                'Sign In'
              )}
            </Button>
            <Button href='/courses' size='sm'>
              Book a Call
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden w-9 h-9 flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DFD0] rounded-sm transition-colors'
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div
            className='absolute inset-0 bg-[#2C2218]/20 backdrop-blur-sm'
            onClick={() => setMenuOpen(false)}
          />
          <div className='absolute top-16 left-0 right-0 bg-[#FAF8F4] border-b border-[#E8DFD0] shadow-lg px-4 py-4 space-y-1'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-sm text-[15px] font-medium no-underline transition-colors tracking-wide ${
                  pathname === link.href
                    ? 'text-[#5C4A38] bg-[#E8DFD0]'
                    : 'text-[#7A6A58] hover:bg-[#F0EBE3] hover:text-[#2C2218]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className='pt-3 flex flex-col gap-2'>
              <Button
                href='/login'
                variant='outline'
                size='md'
                className='w-full'
              >
                Sign In
              </Button>
              <Button href='/courses' size='md' className='w-full'>
                Book a Free Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
