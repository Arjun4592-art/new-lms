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
    <>
      <style>{`
        .profile-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .profile-input {
          width: 100%; padding: 10px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input::placeholder { color: var(--color-primary-muted); }
        .profile-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }
        .profile-input:disabled {
          background-color: var(--color-surface);
          color: var(--color-primary-muted);
          cursor: not-allowed;
        }
        .profile-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .profile-btn {
          padding: 10px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-family: var(--font-sans);
          transition: background-color 0.2s;
        }
        .profile-btn:hover:not(:disabled) { background-color: var(--color-primary-hover); }
        .profile-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .profile-avatar {
          width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
          background-color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 700;
          color: var(--color-bg); overflow: hidden;
        }
        .profile-role-badge {
          display: inline-block; margin-top: 4px;
          padding: 2px 8px; border-radius: 9999px;
          font-size: 11px; font-weight: 600; text-transform: capitalize;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
        }
      `}</style>

      <div className='max-w-2xl mx-auto space-y-8'>
        {/* Header */}
        <div>
          <p
            className='text-[11px] font-semibold uppercase tracking-widest mb-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Account
          </p>
          <h1
            className='font-serif text-[26px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            My Profile
          </h1>
        </div>

        {/* Avatar card */}
        <div className='profile-card flex items-center gap-5'>
          <div className='profile-avatar'>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className='w-full h-full object-cover'
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p
              className='font-semibold text-[16px]'
              style={{ color: 'var(--color-text)' }}
            >
              {user?.name}
            </p>
            <p
              className='text-[13px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              {user?.email}
            </p>
            <span className='profile-role-badge'>{user?.role}</span>
          </div>
        </div>

        {/* Edit profile */}
        <div className='profile-card'>
          <h2
            className='font-serif text-[17px] font-medium mb-5'
            style={{ color: 'var(--color-text)' }}
          >
            Edit Profile
          </h2>
          <form onSubmit={handleSaveProfile} className='space-y-4'>
            <div>
              <label className='profile-label'>Full Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='profile-input'
              />
            </div>
            <div>
              <label className='profile-label'>Email</label>
              <input
                type='email'
                value={user?.email ?? ''}
                disabled
                className='profile-input'
              />
            </div>
            <div>
              <label className='profile-label'>Phone (optional)</label>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='+91 00000 00000'
                className='profile-input'
              />
            </div>
            {saveMsg && (
              <p
                className='text-[13px]'
                style={{ color: saveMsg.includes('!') ? '#16A34A' : '#DC2626' }}
              >
                {saveMsg}
              </p>
            )}
            <button type='submit' disabled={saving} className='profile-btn'>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className='profile-card'>
          <h2
            className='font-serif text-[17px] font-medium mb-5'
            style={{ color: 'var(--color-text)' }}
          >
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className='space-y-4'>
            {[
              {
                label: 'Current Password',
                value: currentPassword,
                setter: setCurrentPassword,
              },
              {
                label: 'New Password',
                value: newPassword,
                setter: setNewPassword,
              },
              {
                label: 'Confirm New Password',
                value: confirmPassword,
                setter: setConfirmPassword,
              },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className='profile-label'>{label}</label>
                <input
                  type='password'
                  value={value}
                  required
                  onChange={(e) => setter(e.target.value)}
                  className='profile-input'
                />
              </div>
            ))}
            {pwError && (
              <p className='text-[13px]' style={{ color: '#DC2626' }}>
                {pwError}
              </p>
            )}
            {pwMsg && (
              <p className='text-[13px]' style={{ color: '#16A34A' }}>
                {pwMsg}
              </p>
            )}
            <button type='submit' disabled={pwLoading} className='profile-btn'>
              {pwLoading ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
