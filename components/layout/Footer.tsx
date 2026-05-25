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
    <footer className='bg-[#1A0D3D] text-white'>
      {/* CTA strip */}
      <div className='bg-linear-to-r from-[#7C5CBF] to-[#A67DD4] py-10 px-4'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <h3 className='font-serif text-[26px] font-bold text-white'>
              Ready to turn your pain into power?
            </h3>
            <p className='text-purple-100 mt-1 text-[15px]'>
              Book a free exploration call with Masuma today.
            </p>
          </div>
          <Link
            href='/courses'
            className='shrink-0 px-8 py-3.5 bg-white text-[#7C5CBF] font-bold rounded-xl hover:bg-purple-50 transition-colors no-underline text-[15px]'
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
            <div className='w-9 h-9 rounded-full bg-linear-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center'>
              <span className='text-white text-[13px] font-bold'>P2P</span>
            </div>
            <div className='leading-none'>
              <p className='font-serif text-[15px] font-bold text-white'>
                Pain to Power
              </p>
              <p className='text-[10px] text-purple-300 tracking-wide'>
                Coaching
              </p>
            </div>
          </div>
          <p className='text-purple-200 text-[13.5px] leading-relaxed mb-5'>
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
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-[#7C5CBF] flex items-center justify-center text-purple-200 hover:text-white transition-all'
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className='text-[13px] font-bold uppercase tracking-widest text-purple-300 mb-4'>
            Pages
          </h4>
          <ul className='space-y-2.5'>
            {LINKS.pages.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className='text-purple-200 hover:text-white text-[14px] no-underline transition-colors'
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h4 className='text-[13px] font-bold uppercase tracking-widest text-purple-300 mb-4'>
            Programs
          </h4>
          <ul className='space-y-2.5'>
            {LINKS.courses.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className='text-purple-200 hover:text-white text-[14px] no-underline transition-colors'
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className='text-[13px] font-bold uppercase tracking-widest text-purple-300 mb-4'>
            Contact
          </h4>
          <ul className='space-y-3'>
            <li>
              <a
                href='mailto:masuma26coach@gmail.com'
                className='flex items-center gap-2 text-purple-200 hover:text-white text-[14px] no-underline transition-colors'
              >
                <MailIcon size={15} /> masuma26coach@gmail.com
              </a>
            </li>
            <li>
              <a
                href='https://instagram.com/masuma_life_coach'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-purple-200 hover:text-white text-[14px] no-underline transition-colors'
              >
                <InstagramIcon size={15} /> @masuma_life_coach
              </a>
            </li>
            <li>
              <a
                href='https://www.youtube.com/@MasumaLifeCoach'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-purple-200 hover:text-white text-[14px] no-underline transition-colors'
              >
                <YoutubeIcon size={15} /> MasumaLifeCoach
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-white/10 py-5 px-4'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-purple-400'>
          <p>
            © {new Date().getFullYear()} Pain to Power Coaching. All rights
            reserved.
          </p>
          <p className='flex items-center gap-1'>
            Made with <HeartIcon size={13} className='text-pink-400' /> for
            healing
          </p>
        </div>
      </div>
    </footer>
  )
}
