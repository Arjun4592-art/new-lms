'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import { MenuIcon, CloseIcon } from '@/components/ui/Icons'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-purple-100' : 'bg-transparent'}`}
      >
        <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 no-underline'>
            <div className='w-9 h-9 rounded-full bg-linear-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center'>
              <span className='text-white text-[13px] font-bold'>P2P</span>
            </div>
            <div className='leading-none'>
              <p className='font-serif text-[15px] font-bold text-[#2D1B5E]'>
                Pain to Power
              </p>
              <p className='text-[10px] text-[#9B7EC8] tracking-wide'>
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
                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all no-underline ${pathname === link.href ? 'text-[#7C5CBF] bg-[#F3EEFF]' : 'text-[#4A3570] hover:text-[#7C5CBF] hover:bg-[#F9F5FF]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className='hidden md:flex items-center gap-3'>
            <Button href='/login' variant='ghost' size='sm'>
              Sign In
            </Button>
            <Button href='/courses' size='sm'>
              Book a Call
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden w-9 h-9 flex items-center justify-center text-[#4A3570] hover:bg-[#F3EEFF] rounded-lg transition-colors'
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div
            className='absolute inset-0 bg-black/20 backdrop-blur-sm'
            onClick={() => setMenuOpen(false)}
          />
          <div className='absolute top-16 left-0 right-0 bg-white border-b border-purple-100 shadow-xl px-4 py-4 space-y-1'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-colors ${pathname === link.href ? 'text-[#7C5CBF] bg-[#F3EEFF]' : 'text-[#4A3570] hover:bg-[#F9F5FF]'}`}
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
