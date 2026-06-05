'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { ArrowRightIcon, ShieldIcon } from '@/components/ui/Icons'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface EnrollButtonProps {
  courseId: string
  isFree: boolean
  isEnrolled: boolean
}

export default function EnrollButton({
  courseId,
  isFree,
  isEnrolled,
}: EnrollButtonProps) {
  const router = useRouter()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEnroll() {
    if (!user) return router.push(`/login?from=/courses/${courseId}`)
    setLoading(true)
    setError('')
    try {
      await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
        userId: user.uid,
        courseId,
        enrolledAt: serverTimestamp(),
        price: 0,
        progress: 0,
        completedLessons: [],
      })

      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      const existing: string[] = userSnap.data()?.enrolledCourses ?? []
      if (!existing.includes(courseId)) {
        await updateDoc(userRef, { enrolledCourses: [...existing, courseId] })
      }

      router.push(`/dashboard/learn/${courseId}`)
    } catch (err: any) {
      setError(err.message ?? 'Enrollment failed')
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <div className='bg-white border border-surface-border rounded-2xl p-6 sticky top-24'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-green-600'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <p className='text-[15px] font-bold text-primary-dark'>
            You are enrolled!
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/learn/${courseId}`)}
          className='w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-[16px] rounded-xl transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2'
        >
          Continue Learning <ArrowRightIcon size={18} />
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='bg-white border border-surface-border rounded-2xl p-6 sticky top-24'>
        <p className='text-[32px] font-bold text-primary-dark mb-1'>Free</p>
        <button
          onClick={() => router.push(`/login?from=/courses/${courseId}`)}
          className='w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-[16px] rounded-xl transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2'
        >
          Sign in to Enroll <ArrowRightIcon size={18} />
        </button>
        <button
          onClick={() => router.push('/contact')}
          className='w-full mt-3 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-surface transition-colors'
        >
          Book a Free Call First
        </button>
        <div className='mt-5 space-y-2'>
          {[
            'Safe, judgment-free space',
            'Women only programme',
            'Free to join',
            'Instalment options available',
          ].map((item) => (
            <div
              key={item}
              className='flex items-center gap-2 text-[13px] text-primary-mid'
            >
              <ShieldIcon size={13} className='text-primary shrink-0' />
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white border border-surface-border rounded-2xl p-6 sticky top-24'>
      <p className='text-[32px] font-bold text-primary-dark mb-1'>Free</p>

      {error && (
        <div className='mb-4 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
          {error}
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className='w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-[16px] rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-60 flex items-center justify-center gap-2'
      >
        {loading ? (
          <svg className='animate-spin w-5 h-5' viewBox='0 0 24 24' fill='none'>
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
        ) : (
          <>
            Enroll for Free <ArrowRightIcon size={18} />
          </>
        )}
      </button>

      <button
        onClick={() => router.push('/contact')}
        className='w-full mt-3 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-surface transition-colors'
      >
        Book a Free Call First
      </button>

      <div className='mt-5 space-y-2'>
        {[
          'Safe, judgment-free space',
          'Women only programme',
          'Free to join',
          'Instalment options available',
        ].map((item) => (
          <div
            key={item}
            className='flex items-center gap-2 text-[13px] text-primary-mid'
          >
            <ShieldIcon size={13} className='text-primary shrink-0' />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
