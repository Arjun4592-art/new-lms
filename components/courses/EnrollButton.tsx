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

const TRUST_ITEMS = [
  'Safe, judgment-free space',
  'Open to all individuals',
  'Free to join',
  'Instalment options available',
]

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

  const cardStyle = {
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-surface-border)',
  }

  const primaryBtnClass =
    'w-full py-4 font-semibold text-[15px] rounded-xl transition-all flex items-center justify-center gap-2'

  const outlineBtnClass =
    'w-full mt-3 py-3 font-semibold rounded-xl transition-colors border-2'

  // ── Enrolled state ──
  if (isEnrolled) {
    return (
      <div className='rounded-xl p-6 sticky top-24' style={cardStyle}>
        <div className='mb-4 flex items-center gap-2'>
          <div
            className='w-8 h-8 rounded-full flex items-center justify-center'
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <svg
              width='13'
              height='13'
              viewBox='0 0 24 24'
              fill='none'
              stroke='var(--color-primary)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <p
            className='text-[15px] font-semibold'
            style={{ color: 'var(--color-text)' }}
          >
            You are enrolled!
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/learn/${courseId}`)}
          className={primaryBtnClass}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            boxShadow: '0 8px 24px rgba(122,106,88,0.25)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              'var(--color-primary-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
          }
        >
          Continue Learning <ArrowRightIcon size={18} />
        </button>
      </div>
    )
  }

  // ── Not logged in ──
  if (!user) {
    return (
      <div className='rounded-xl p-6 sticky top-24' style={cardStyle}>
        <p
          className='text-[32px] font-semibold mb-4'
          style={{ color: 'var(--color-text)' }}
        >
          Free
        </p>
        <button
          onClick={() => router.push(`/login?from=/courses/${courseId}`)}
          className={primaryBtnClass}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            boxShadow: '0 8px 24px rgba(122,106,88,0.25)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              'var(--color-primary-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
          }
        >
          Sign in to Enroll <ArrowRightIcon size={18} />
        </button>
        <button
          onClick={() => router.push('/contact')}
          className={outlineBtnClass}
          style={{
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          Book a Free Call First
        </button>
        <TrustList />
      </div>
    )
  }

  // ── Logged in, not enrolled ──
  return (
    <div className='rounded-xl p-6 sticky top-24' style={cardStyle}>
      <p
        className='text-[32px] font-semibold mb-4'
        style={{ color: 'var(--color-text)' }}
      >
        Free
      </p>

      {error && (
        <div
          className='mb-4 text-[13px] px-4 py-3 rounded-xl'
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className={`${primaryBtnClass} disabled:opacity-60`}
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-bg)',
          boxShadow: '0 8px 24px rgba(122,106,88,0.25)',
        }}
        onMouseEnter={(e) =>
          !loading &&
          (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
        }
      >
        {loading ? (
          <svg className='animate-spin w-5 h-5' viewBox='0 0 24 24' fill='none'>
            <circle
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
              className='opacity-25'
            />
            <path
              fill='currentColor'
              d='M4 12a8 8 0 018-8v8H4z'
              className='opacity-75'
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
        className={outlineBtnClass}
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'transparent')
        }
      >
        Book a Free Call First
      </button>

      <TrustList />
    </div>
  )
}

function TrustList() {
  return (
    <div className='mt-5 space-y-2'>
      {TRUST_ITEMS.map((item) => (
        <div
          key={item}
          className='flex items-center gap-2 text-[13px] font-light'
          style={{ color: 'var(--color-primary-mid)' }}
        >
          <ShieldIcon
            size={13}
            style={{ color: 'var(--color-primary)', flexShrink: 0 }}
          />
          {item}
        </div>
      ))}
    </div>
  )
}
