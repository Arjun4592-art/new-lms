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
      <div className='space-y-6 animate-pulse'>
        <div className='grid grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-32 bg-purple-100 rounded-2xl' />
          ))}
        </div>
        <div className='h-64 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <div>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Revenue
        </h1>
        <p className='text-[13px] text-[#8470A8]'>
          Payment history and earnings overview
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
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

      {/* Payments table */}
      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-4 border-b border-purple-100 bg-[#F9F5FF]'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
            Payment History
          </h2>
        </div>

        <div className='px-6 py-3 border-b border-purple-50 grid grid-cols-12 gap-4'>
          <p className='col-span-3 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Student
          </p>
          <p className='col-span-4 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Course
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Amount
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Date
          </p>
        </div>

        {payments.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <CreditCardIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-[#2D1B5E]'>
              No payments yet
            </p>
          </div>
        ) : (
          <div className='divide-y divide-purple-50'>
            {payments.map((p, i) => (
              <div
                key={i}
                className='px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#FAFAFE]'
              >
                <div className='col-span-3'>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                    {p.studentName}
                  </p>
                  <p className='text-[11.5px] text-[#8470A8] truncate'>
                    {p.studentEmail}
                  </p>
                </div>
                <p className='col-span-4 text-[13px] text-[#8470A8] truncate'>
                  {p.courseName}
                </p>
                <p className='col-span-2 text-[13.5px] font-bold text-[#2D1B5E]'>
                  ₹{p.amount.toLocaleString('en-IN')}
                </p>
                <p className='col-span-3 text-[13px] text-[#8470A8]'>
                  {new Date(p.enrolledAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
