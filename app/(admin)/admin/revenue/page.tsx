'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Enrollment, LMSUser, Course } from '@/types'
import { CreditCardIcon, TrendingUpIcon } from '@/components/ui/Icons'
import StatCard from '@/components/admin/StatCard'

interface PaymentRecord {
  studentName: string
  studentEmail: string
  courseName: string
  amount: number
  enrolledAt: string
}

export default function AdminRevenuePage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const [enrollSnap, studentSnap, courseSnap] = await Promise.all([
          getDocs(collection(db, 'enrollments')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'courses')),
        ])

        const enrollments = enrollSnap.docs.map((d) => d.data() as Enrollment)
        const students = studentSnap.docs.map(
          (d) => ({ uid: d.id, ...d.data() }) as LMSUser,
        )
        const courses = courseSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Course,
        )

        const records: PaymentRecord[] = enrollments
          .filter((e) => e.price > 0)
          .map((e) => ({
            studentName:
              students.find((s) => s.uid === e.userId)?.name ?? 'Unknown',
            studentEmail: students.find((s) => s.uid === e.userId)?.email ?? '',
            courseName:
              courses.find((c) => c.id === e.courseId)?.title ?? e.courseId,
            amount: e.price,
            enrolledAt: e.enrolledAt,
          }))
          .sort(
            (a, b) =>
              new Date(b.enrolledAt).getTime() -
              new Date(a.enrolledAt).getTime(),
          )

        const total = records.reduce((s, r) => s + r.amount, 0)
        const thisMonth = new Date()
        const monthly = records
          .filter((r) => {
            const d = new Date(r.enrolledAt)
            return (
              d.getMonth() === thisMonth.getMonth() &&
              d.getFullYear() === thisMonth.getFullYear()
            )
          })
          .reduce((s, r) => s + r.amount, 0)

        setPayments(records)
        setTotalRevenue(total)
        setMonthlyRevenue(monthly)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-32 bg-surface rounded-2xl' />
          ))}
        </div>
        <div className='h-64 bg-surface rounded-2xl' />
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto px-4 sm:px-6'>
      {/* Header */}
      <div className='animate-[fadeInDown_0.4s_ease_both]'>
        <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
          Revenue
        </h1>
        <p className='text-[13px] text-primary-muted mt-0.5'>
          Payment history and earnings overview
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 animate-[fadeInUp_0.4s_ease_both]'>
        <StatCard
          title='Total Revenue'
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtitle='All time'
          icon={<CreditCardIcon size={18} />}
          color='purple'
        />
        <StatCard
          title='This Month'
          value={`₹${monthlyRevenue.toLocaleString('en-IN')}`}
          subtitle='Current month'
          icon={<TrendingUpIcon size={18} />}
          color='green'
        />
        <StatCard
          title='Transactions'
          value={payments.length}
          subtitle='Paid enrollments'
          icon={<CreditCardIcon size={18} />}
          color='blue'
        />
      </div>

      {/* Table */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease_both]'>
        {/* Table title */}
        <div className='px-6 py-4 border-b border-surface-border bg-surface'>
          <h2 className='font-serif text-[17px] font-bold text-primary-dark'>
            Payment History
          </h2>
        </div>

        {/* Column headers — hidden on mobile */}
        <div className='hidden sm:grid px-6 py-3 border-b border-surface-border grid-cols-12 gap-4'>
          <p className='col-span-3 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Student
          </p>
          <p className='col-span-4 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Course
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Amount
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Date
          </p>
        </div>

        {payments.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <CreditCardIcon
              size={32}
              className='text-primary-muted mx-auto mb-3'
            />
            <p className='text-[15px] font-semibold text-primary-dark'>
              No payments yet
            </p>
          </div>
        ) : (
          <div className='divide-y divide-surface-border'>
            {payments.map((p, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 50}ms` }}
                className='animate-[fadeInUp_0.35s_ease_both] px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center hover:bg-surface transition-colors duration-150'
              >
                {/* Student */}
                <div className='sm:col-span-3'>
                  <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                    {p.studentName}
                  </p>
                  <p className='text-[11.5px] text-primary-muted truncate'>
                    {p.studentEmail}
                  </p>
                </div>

                {/* Mobile: inline labels */}
                <div className='flex flex-wrap gap-x-4 gap-y-1 sm:contents'>
                  <p className='sm:col-span-4 text-[13px] text-primary-muted truncate'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Course:{' '}
                    </span>
                    {p.courseName}
                  </p>
                  <p className='sm:col-span-2 text-[13.5px] font-bold text-primary-dark'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Amount:{' '}
                    </span>
                    ₹{p.amount.toLocaleString('en-IN')}
                  </p>
                  <p className='sm:col-span-3 text-[13px] text-primary-muted'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Date:{' '}
                    </span>
                    {new Date(p.enrolledAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
