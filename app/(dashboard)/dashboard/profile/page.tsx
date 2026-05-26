'use client'

import { useState, useEffect } from 'react'
import {
  ShieldIcon,
  MailIcon,
  UserIcon,
  CheckIcon,
} from '@/components/ui/Icons'
import { useAuth } from '@/context/AuthContext'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Populate fields when user loads
  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setPhone((user as any).phone ?? '')
    }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      // Update Firebase Auth display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name })
      }

      // Update Firestore user doc
      await updateDoc(doc(db, 'users', user!.uid), {
        name,
        phone,
      })

      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='space-y-6 max-w-3xl mx-auto animate-pulse'>
        <div className='h-8 w-48 bg-purple-100 rounded' />
        <div className='h-36 bg-purple-100 rounded-2xl' />
        <div className='h-64 bg-purple-100 rounded-2xl' />
      </div>
    )
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
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            className='w-20 h-20 rounded-full object-cover border-4 border-white/30'
          />
        ) : (
          <div className='w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-white text-[30px] font-bold shrink-0'>
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
        )}
        <div>
          <h2 className='font-serif text-[22px] font-bold'>{user?.name}</h2>
          <p className='text-purple-200 text-[14px]'>{user?.email}</p>
          <div className='flex items-center gap-1.5 mt-2 bg-white/20 px-3 py-1 rounded-full w-fit'>
            <ShieldIcon size={12} className='text-purple-200' />
            <span className='text-[12px] text-purple-100 font-medium capitalize'>
              {user?.role} · Active
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className='bg-white border border-purple-100 rounded-2xl p-7'>
        <h2 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-5'>
          Personal Information
        </h2>

        {error && (
          <div className='mb-4 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
            {error}
          </div>
        )}

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
                value={user?.email ?? ''}
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
        {user?.enrolledCourses && user.enrolledCourses.length > 0 ? (
          <div className='space-y-4'>
            {user.enrolledCourses.map((courseId) => (
              <div key={courseId} className='flex items-center gap-4'>
                <div className='flex-1 min-w-0'>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                    {courseId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-[13.5px] text-[#8470A8]'>
            You haven't enrolled in any courses yet.
          </p>
        )}
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
