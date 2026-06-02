'use client'

import { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { changePassword } from '@/lib/firebase/auth'

export default function ProfilePage() {
  const { user, refreshUser } = useAuthContext()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      await updateDoc(doc(db, 'users', user!.uid), { name, phone })
      if (auth.currentUser)
        await updateProfile(auth.currentUser, { displayName: name })
      await refreshUser()
      setSaveMsg('Profile updated!')
    } catch (err: any) {
      setSaveMsg(err.message ?? 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwMsg('')
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters')
      return
    }
    setPwLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPwMsg('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPwError(err.message ?? 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <div>
        <p className='text-[12px] text-primary-accent font-semibold uppercase tracking-widest mb-1'>
          Account
        </p>
        <h1 className='font-serif text-[26px] font-bold text-primary-dark'>
          My Profile
        </h1>
      </div>

      {/* Avatar */}
      <div className='bg-white border border-surface-border rounded-2xl p-6 flex items-center gap-5'>
        <div className='w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-white text-[24px] font-bold shrink-0'>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className='w-full h-full rounded-full object-cover'
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className='font-semibold text-primary-dark text-[16px]'>
            {user?.name}
          </p>
          <p className='text-[13px] text-primary-muted'>{user?.email}</p>
          <span className='inline-block mt-1 px-2 py-0.5 bg-surface text-primary text-[11px] font-bold rounded-full capitalize'>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Edit profile */}
      <div className='bg-white border border-surface-border rounded-2xl p-6'>
        <h2 className='font-serif text-[17px] font-bold text-primary-dark mb-5'>
          Edit Profile
        </h2>
        <form onSubmit={handleSaveProfile} className='space-y-4'>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Email
            </label>
            <input
              type='email'
              value={user?.email ?? ''}
              disabled
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-muted bg-surface cursor-not-allowed'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Phone (optional)
            </label>
            <input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+91 00000 00000'
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
            />
          </div>
          {saveMsg && <p className='text-[13px] text-green-600'>{saveMsg}</p>}
          <button
            type='submit'
            disabled={saving}
            className='px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-[14px] transition-colors disabled:opacity-60'
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className='bg-white border border-surface-border rounded-2xl p-6'>
        <h2 className='font-serif text-[17px] font-bold text-primary-dark mb-5'>
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className='space-y-4'>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Current Password
            </label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              New Password
            </label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Confirm New Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full px-4 py-2.5 border border-surface-border rounded-xl text-[14px] text-primary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
            />
          </div>
          {pwError && <p className='text-[13px] text-red-500'>{pwError}</p>}
          {pwMsg && <p className='text-[13px] text-green-600'>{pwMsg}</p>}
          <button
            type='submit'
            disabled={pwLoading}
            className='px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-[14px] transition-colors disabled:opacity-60'
          >
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
