'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Course } from '@/types'

// ── Fetch all published courses ───────────────────────────────────────────────

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, 'courses'),
          where('published', '==', true),
        )
        const snap = await getDocs(q)
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course)
        setCourses(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { courses, loading, error }
}

// ── Fetch a single course ─────────────────────────────────────────────────────

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, 'courses', courseId))
        if (snap.exists()) {
          setCourse({ id: snap.id, ...snap.data() } as Course)
        } else {
          setError('Course not found')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load course')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [courseId])

  return { course, loading, error }
}

// ── Fetch enrolled courses for a user ────────────────────────────────────────

export function useEnrolledCourses(courseIds: string[]) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseIds.length) {
      setCourses([])
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        const promises = courseIds.map((id) => getDoc(doc(db, 'courses', id)))
        const snaps = await Promise.all(promises)
        const data = snaps
          .filter((s) => s.exists())
          .map((s) => ({ id: s.id, ...s.data() }) as Course)
        setCourses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [courseIds.join(',')])

  return { courses, loading }
}
