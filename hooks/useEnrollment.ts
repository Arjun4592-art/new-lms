'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
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
      // Try uid_courseId first, fallback to query
      const snap = await getDoc(doc(db, 'enrollments', `${uid}_${courseId}`))
      if (snap.exists()) {
        setEnrollment(snap.data() as Enrollment)
      } else {
        // Fallback: query by userId + courseId
        const q = query(
          collection(db, 'enrollments'),
          where('userId', '==', uid),
          where('courseId', '==', courseId),
        )
        const qSnap = await getDocs(q)
        setEnrollment(qSnap.empty ? null : (qSnap.docs[0].data() as Enrollment))
      }
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

  const refetch = useCallback(async () => {
    if (!uid) {
      setEnrollments({})
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Query ALL enrollments for this user — no dependency on courseIds
      const snap = await getDocs(
        query(collection(db, 'enrollments'), where('userId', '==', uid)),
      )
      const data: Record<string, Enrollment> = {}
      snap.docs.forEach((d) => {
        const e = d.data() as Enrollment
        if (e.courseId) data[e.courseId] = e
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
  }, [uid])

  useEffect(() => {
    refetch()
  }, [refetch])
  return { enrollments, loading, error, refetch }
}

// ── Mark lesson complete ──────────────────────────────────────────────────

export async function markLessonComplete(
  uid: string,
  courseId: string,
  lessonId: string,
  totalLessons: number,
): Promise<void> {
  const ref = doc(db, 'enrollments', `${uid}_${courseId}`)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const data = snap.data() as Enrollment
  const completed = new Set(data.completedLessons ?? [])
  completed.add(lessonId)
  const progress = Math.round((completed.size / totalLessons) * 100)

  await setDoc(
    ref,
    {
      completedLessons: Array.from(completed),
      progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
