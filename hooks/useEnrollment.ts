'use client'

import { useEffect, useState, useCallback } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Enrollment } from '@/types'

// ── Fetch a single enrollment ─────────────────────────────────────────────────

export function useEnrollment(uid: string | undefined, courseId: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!uid || !courseId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const snap = await getDoc(doc(db, 'enrollments', `${uid}_${courseId}`))
      setEnrollment(snap.exists() ? (snap.data() as Enrollment) : null)
    } catch (err) {
      console.error('[useEnrollment]', err)
      setError(
        err instanceof Error ? err : new Error('Failed to fetch enrollment'),
      )
    } finally {
      setLoading(false)
    }
  }, [uid, courseId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { enrollment, loading, error, refetch }
}

// ── Fetch all enrollments for a user ─────────────────────────────────────────

export function useUserEnrollments(
  uid: string | undefined,
  courseIds: string[],
) {
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const courseIdsKey = courseIds.join(',')

  const refetch = useCallback(async () => {
    if (!uid || !courseIds.length) {
      setEnrollments({})
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const snaps = await Promise.all(
        courseIds.map((courseId) =>
          getDoc(doc(db, 'enrollments', `${uid}_${courseId}`)),
        ),
      )

      const data: Record<string, Enrollment> = {}
      snaps.forEach((snap) => {
        if (snap.exists()) {
          const e = snap.data() as Enrollment
          data[e.courseId] = e
        }
      })

      setEnrollments(data)
    } catch (err) {
      console.error('[useUserEnrollments]', err)
      setError(
        err instanceof Error ? err : new Error('Failed to fetch enrollments'),
      )
    } finally {
      setLoading(false)
    }
  }, [uid, courseIdsKey])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { enrollments, loading, error, refetch }
}

// ── Mark a lesson as complete ─────────────────────────────────────────────────

export async function markLessonComplete(
  uid: string,
  courseId: string,
  lessonId: string,
  totalLessons: number,
): Promise<{ progress: number; completedLessons: string[] }> {
  if (!uid || !courseId || !lessonId) {
    throw new Error('Missing required parameters')
  }
  if (totalLessons <= 0) {
    throw new Error('totalLessons must be greater than 0')
  }

  const ref = doc(db, 'enrollments', `${uid}_${courseId}`)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    throw new Error(`Enrollment not found for ${uid}_${courseId}`)
  }

  const data = snap.data() as Enrollment
  const completed = new Set(data.completedLessons ?? [])

  // No-op if already marked complete
  if (completed.has(lessonId)) {
    return {
      progress: data.progress ?? 0,
      completedLessons: Array.from(completed),
    }
  }

  completed.add(lessonId)
  const progress = Math.min(
    Math.round((completed.size / totalLessons) * 100),
    100,
  )
  const completedLessons = Array.from(completed)

  await setDoc(
    ref,
    {
      completedLessons,
      progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return { progress, completedLessons }
}

// ── Mark a lesson as incomplete ───────────────────────────────────────────────

export async function markLessonIncomplete(
  uid: string,
  courseId: string,
  lessonId: string,
  totalLessons: number,
): Promise<{ progress: number; completedLessons: string[] }> {
  if (!uid || !courseId || !lessonId) {
    throw new Error('Missing required parameters')
  }

  const ref = doc(db, 'enrollments', `${uid}_${courseId}`)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    throw new Error(`Enrollment not found for ${uid}_${courseId}`)
  }

  const data = snap.data() as Enrollment
  const completed = new Set(data.completedLessons ?? [])

  completed.delete(lessonId)
  const progress =
    totalLessons > 0
      ? Math.min(Math.round((completed.size / totalLessons) * 100), 100)
      : 0
  const completedLessons = Array.from(completed)

  await setDoc(
    ref,
    {
      completedLessons,
      progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return { progress, completedLessons }
}
