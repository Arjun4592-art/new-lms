'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
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
      <div className='space-y-4 animate-pulse'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='h-16 bg-purple-100 rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
            Students
          </h1>
          <p className='text-[13px] text-[#8470A8]'>
            {students.length} total students
          </p>
        </div>
      </div>

      {/* Search */}
      <div className='relative'>
        <SearchIcon
          size={15}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
        />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by name or email...'
          className='w-full pl-9 pr-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all bg-white'
        />
      </div>

      {/* Table */}
      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-3 border-b border-purple-100 bg-[#F9F5FF] grid grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Student
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Email
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Courses
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Joined
          </p>
          <p className='col-span-1 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Action
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <UsersIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
              No students found
            </p>
          </div>
        ) : (
          <div className='divide-y divide-purple-50'>
            {filtered.map((student) => (
              <div
                key={student.uid}
                className='px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#FAFAFE]'
              >
                <div className='col-span-4 flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center text-white text-[12px] font-bold shrink-0'>
                    {student.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                    {student.name}
                  </p>
                </div>
                <p className='col-span-3 text-[13px] text-[#8470A8] truncate'>
                  {student.email}
                </p>
                <p className='col-span-2 text-[13px] text-[#2D1B5E] font-semibold'>
                  {student.enrolledCourses?.length ?? 0}
                </p>
                <p className='col-span-2 text-[13px] text-[#8470A8]'>
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

                <div className='col-span-1'>
                  <Link
                    href={`/admin/students/${student.uid}`}
                    className='flex items-center gap-1 text-[12px] font-semibold text-[#7C5CBF] hover:text-[#6A4DAD] no-underline'
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
