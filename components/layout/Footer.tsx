'use client'

import Link from 'next/link'
import {
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
  MailIcon,
  HeartIcon,
} from '../ui/Icons'

const LINKS = {
  pages: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Contact', href: '/contact' },
  ],
  courses: [
    { label: 'Pain to Power Masterclass', href: '/courses' },
    { label: '5-Day WhatsApp Challenge', href: '/courses' },
    { label: '4-Week Healing Programme', href: '/courses' },
    { label: 'Self-Boundaries Course', href: '/courses' },
    { label: 'Recorded Healing Workshops', href: '/courses' },
  ],
  social: [
    {
      label: 'Instagram',
      href: 'https://instagram.com/masuma_life_coach',
      icon: <InstagramIcon size={18} />,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@MasumaLifeCoach',
      icon: <YoutubeIcon size={18} />,
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/',
      icon: <WhatsAppIcon size={18} />,
    },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{ fontFamily: "'Raleway', sans-serif" }}
      className='bg-[#2C2218] text-[#E8DFD0]'
    >
      {/* CTA strip */}
      <div className='bg-[#5C4A38] py-10 px-4 border-b border-[#4A3F36]'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <h3 className='font-serif text-[26px] font-medium text-[#FAF8F4]'>
              Ready to turn your pain into power?
            </h3>
            <p className='text-[#D8CEBC] mt-1 text-[15px] font-light'>
              Book a free exploration call with Masuma today.
            </p>
          </div>
          <Link
            href='/courses'
            className='shrink-0 px-8 py-3.5 bg-[#FAF8F4] text-[#5C4A38] font-semibold rounded-sm hover:bg-[#E8DFD0] transition-colors no-underline text-[14px] uppercase tracking-widest'
          >
            Book a Free Call
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className='max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        {/* Brand */}
        <div className='lg:col-span-1'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-9 h-9 rounded-full bg-[#5C4A38] border border-[#7A6A58] flex items-center justify-center'>
              <span className='text-[#FAF8F4] text-[12px] font-semibold tracking-wide'>
                P2P
              </span>
            </div>
            <div className='leading-none'>
              <p className='font-serif text-[15px] font-medium text-[#FAF8F4]'>
                Pain to Power
              </p>
              <p className='text-[10px] text-[#B8A898] tracking-widest uppercase'>
                Coaching
              </p>
            </div>
          </div>
          <p className='text-[#B8A898] text-[13.5px] leading-relaxed mb-5 font-light'>
            Transforming emotional pain into confidence, clarity & inner
            strength. A safe space for women to heal and rise.
          </p>
          <div className='flex items-center gap-3'>
            {LINKS.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target='_blank'
                rel='noopener noreferrer'
                className='w-9 h-9 rounded-full bg-[#3A2E24] border border-[#5C4A38] hover:bg-[#5C4A38] flex items-center justify-center text-[#B8A898] hover:text-[#FAF8F4] transition-all'
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className='text-[11px] font-semibold uppercase tracking-widest text-[#7A6A58] mb-4'>
            Pages
          </h4>
          <ul className='space-y-2.5'>
            {LINKS.pages.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className='text-[#B8A898] hover:text-[#FAF8F4] text-[14px] no-underline transition-colors font-light'
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h4 className='text-[11px] font-semibold uppercase tracking-widest text-[#7A6A58] mb-4'>
            Programs
          </h4>
          <ul className='space-y-2.5'>
            {LINKS.courses.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className='text-[#B8A898] hover:text-[#FAF8F4] text-[14px] no-underline transition-colors font-light'
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className='text-[11px] font-semibold uppercase tracking-widest text-[#7A6A58] mb-4'>
            Contact
          </h4>
          <ul className='space-y-3'>
            <li>
              <a
                href='mailto:masuma26coach@gmail.com'
                className='flex items-center gap-2 text-[#B8A898] hover:text-[#FAF8F4] text-[14px] no-underline transition-colors font-light'
              >
                <MailIcon size={15} /> masuma26coach@gmail.com
              </a>
            </li>
            <li>
              <a
                href='https://instagram.com/masuma_life_coach'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-[#B8A898] hover:text-[#FAF8F4] text-[14px] no-underline transition-colors font-light'
              >
                <InstagramIcon size={15} /> @masuma_life_coach
              </a>
            </li>
            <li>
              <a
                href='https://www.youtube.com/@MasumaLifeCoach'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-[#B8A898] hover:text-[#FAF8F4] text-[14px] no-underline transition-colors font-light'
              >
                <YoutubeIcon size={15} /> MasumaLifeCoach
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-[#3A2E24] py-5 px-4'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#7A6A58]'>
          <p>
            © {new Date().getFullYear()} Pain to Power Coaching. All rights
            reserved.
          </p>
          <p className='flex items-center gap-1'>
            Made with <HeartIcon size={13} className='text-[#B8A898]' /> for
            healing
          </p>
        </div>
      </div>
    </footer>
  )
}
