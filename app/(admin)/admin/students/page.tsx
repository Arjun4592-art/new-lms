'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { LMSUser } from '@/types'
import { SearchIcon, ArrowRightIcon, UsersIcon } from '@/components/ui/Icons'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<LMSUser[]>([])
  const [filtered, setFiltered] = useState<LMSUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'student')),
        )
        const data = snap.docs.map(
          (d) => ({ uid: d.id, ...d.data() }) as LMSUser,
        )
        setStudents(data)
        setFiltered(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      students.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q),
      ),
    )
  }, [search, students])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-6xl mx-auto px-4 sm:px-6'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='h-16 bg-surface rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto px-4 sm:px-6'>
      {/* Header */}
      <div className='animate-[fadeInDown_0.4s_ease_both]'>
        <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
          Students
        </h1>
        <p className='text-[13px] text-primary-muted mt-0.5'>
          {students.length} total students
        </p>
      </div>

      {/* Search */}
      <div className='relative animate-[fadeInUp_0.4s_ease_both]'>
        <SearchIcon
          size={15}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-primary-muted'
        />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by name or email...'
          className='w-full pl-9 pr-4 py-3 border border-surface-border rounded-xl text-[14px] text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(122,106,88,0.12)] transition-all bg-[#f5f0e8] placeholder:text-primary-muted'
        />
      </div>

      {/* Table */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease_both]'>
        {/* Column headers — hidden on mobile */}
        <div className='hidden sm:grid px-6 py-3 border-b border-surface-border bg-surface grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Student
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Email
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Courses
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Joined
          </p>
          <p className='col-span-1 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Action
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <UsersIcon size={32} className='text-primary-muted mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-primary-dark mb-1'>
              No students found
            </p>
          </div>
        ) : (
          <div className='divide-y divide-surface-border'>
            {filtered.map((student, i) => (
              <div
                key={student.uid}
                style={{ animationDelay: `${i * 50}ms` }}
                className='animate-[fadeInUp_0.35s_ease_both] px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center hover:bg-surface transition-colors duration-150'
              >
                {/* Name + Avatar */}
                <div className='sm:col-span-4 flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-primary flex items-center justify-center text-[#f5f0e8] text-[12px] font-bold shrink-0'>
                    {student.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                    {student.name}
                  </p>
                </div>

                {/* Mobile: inline labels */}
                <div className='flex flex-wrap gap-x-4 gap-y-1 sm:contents'>
                  <p className='sm:col-span-3 text-[13px] text-primary-muted truncate'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Email:{' '}
                    </span>
                    {student.email}
                  </p>
                  <p className='sm:col-span-2 text-[13px] text-primary-dark font-semibold'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Courses:{' '}
                    </span>
                    {student.enrolledCourses?.length ?? 0}
                  </p>
                  <p className='sm:col-span-2 text-[13px] text-primary-muted'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Joined:{' '}
                    </span>
                    {(() => {
                      const createdAt = student.createdAt
                      const date =
                        createdAt && typeof createdAt !== 'string'
                          ? ((createdAt as any)?.toDate?.() ??
                            new Date(createdAt))
                          : new Date(createdAt as string)
                      return date.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    })()}
                  </p>
                </div>

                {/* Action */}
                <div className='sm:col-span-1'>
                  <Link
                    href={`/admin/students/${student.uid}`}
                    className='flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-hover no-underline transition-colors duration-150'
                  >
                    View <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
