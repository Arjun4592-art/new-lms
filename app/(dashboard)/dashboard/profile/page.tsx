'use client'

import { useState } from 'react'
import {
  ShieldIcon,
  MailIcon,
  UserIcon,
  CheckIcon,
} from '@/components/ui/Icons'

const ENROLLED_COURSES = [
  {
    title: 'Pain to Power Masterclass',
    progress: 65,
    enrolledDate: 'May 1, 2025',
  },
  {
    title: 'Self-Boundaries & Letting Go',
    progress: 100,
    enrolledDate: 'Apr 10, 2025',
  },
  {
    title: 'Recorded Healing Workshops',
    progress: 33,
    enrolledDate: 'May 10, 2025',
  },
]

export default function ProfilePage() {
  const [name, setName] = useState('Priya Sharma')
  const [email] = useState('priya@gmail.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className='space-y-6 max-w-3xl mx-auto'>
      {/* Header */}
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Account
        </p>
        <h1 className='font-serif text-[26px] sm:text-[30px] font-bold text-[#2D1B5E]'>
          My Profile
        </h1>
      </div>

      {/* Avatar + name card */}
      <div className='bg-gradient-to-br from-[#7C5CBF] to-[#A67DD4] rounded-2xl p-7 flex items-center gap-6 text-white'>
        <div className='w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-white text-[30px] font-bold shrink-0'>
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className='font-serif text-[22px] font-bold'>{name}</h2>
          <p className='text-purple-200 text-[14px]'>{email}</p>
          <div className='flex items-center gap-1.5 mt-2 bg-white/20 px-3 py-1 rounded-full w-fit'>
            <ShieldIcon size={12} className='text-purple-200' />
            <span className='text-[12px] text-purple-100 font-medium'>
              Student · Active
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className='bg-white border border-purple-100 rounded-2xl p-7'>
        <h2 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-5'>
          Personal Information
        </h2>
        <form onSubmit={handleSave} className='space-y-5'>
          {/* Name */}
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Full Name
            </label>
            <div className='relative'>
              <UserIcon
                size={15}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
              />
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full pl-9 pr-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
              />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Email Address
            </label>
            <div className='relative'>
              <MailIcon
                size={15}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
              />
              <input
                type='email'
                value={email}
                disabled
                className='w-full pl-9 pr-4 py-3 border border-purple-100 rounded-xl text-[14px] text-[#8470A8] bg-[#FAF8FF] cursor-not-allowed'
              />
            </div>
            <p className='text-[11.5px] text-[#B0A0CC] mt-1'>
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Phone Number
            </label>
            <input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+91 98765 43210'
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>

          <button
            type='submit'
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all ${
              saved
                ? 'bg-green-100 text-green-700'
                : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white shadow-lg shadow-purple-200'
            } disabled:opacity-60`}
          >
            {saving ? (
              <svg
                className='animate-spin w-4 h-4'
                viewBox='0 0 24 24'
                fill='none'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                />
              </svg>
            ) : saved ? (
              <CheckIcon size={16} />
            ) : null}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className='bg-white border border-purple-100 rounded-2xl p-7'>
        <h2 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-1'>
          Password
        </h2>
        <p className='text-[13.5px] text-[#8470A8] mb-5'>
          Update your password to keep your account secure.
        </p>
        <div className='space-y-4'>
          {['Current Password', 'New Password', 'Confirm New Password'].map(
            (label) => (
              <div key={label}>
                <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                  {label}
                </label>
                <input
                  type='password'
                  placeholder='••••••••'
                  className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                />
              </div>
            ),
          )}
          <button className='px-6 py-3 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl text-[14px] transition-all shadow-lg shadow-purple-200'>
            Update Password
          </button>
        </div>
      </div>

      {/* Enrolled courses summary */}
      <div className='bg-white border border-purple-100 rounded-2xl p-7'>
        <h2 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-5'>
          My Enrollments
        </h2>
        <div className='space-y-4'>
          {ENROLLED_COURSES.map((course) => (
            <div key={course.title} className='flex items-center gap-4'>
              <div className='flex-1 min-w-0'>
                <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                  {course.title}
                </p>
                <p className='text-[12px] text-[#8470A8]'>
                  Enrolled {course.enrolledDate}
                </p>
              </div>
              <div className='w-24 shrink-0'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-[11px] text-[#7C5CBF] font-semibold'>
                    {course.progress}%
                  </span>
                </div>
                <div className='h-1.5 bg-purple-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#7C5CBF] rounded-full'
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className='bg-white border border-red-100 rounded-2xl p-7'>
        <h2 className='font-serif text-[18px] font-bold text-red-600 mb-1'>
          Danger Zone
        </h2>
        <p className='text-[13.5px] text-[#8470A8] mb-5'>
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <button className='px-5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-[13.5px] font-semibold transition-colors'>
          Delete My Account
        </button>
      </div>
    </div>
  )
}
