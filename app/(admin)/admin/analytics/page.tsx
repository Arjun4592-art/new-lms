'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { Course, Enrollment, LMSUser } from '@/types'

const COLORS = ['#7C5CBF', '#C084F5', '#A67DD4', '#8B5CF6', '#9B6FC8']

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [enrollmentData, setEnrollmentData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [coursePopularity, setCoursePopularity] = useState<any[]>([])
  const [studentGrowth, setStudentGrowth] = useState<any[]>([])
  const [completionRates, setCompletionRates] = useState<any[]>([])

  useEffect(() => {
    async function fetch() {
      try {
        const [enrollSnap, courseSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, 'enrollments')),
          getDocs(collection(db, 'courses')),
          getDocs(
            query(collection(db, 'users'), where('role', '==', 'student')),
          ),
        ])

        const enrollments = enrollSnap.docs.map((d) => d.data() as Enrollment)
        const courses = courseSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Course,
        )
        const students = studentSnap.docs.map((d) => d.data() as LMSUser)

        // Monthly enrollment data
        const monthlyMap: Record<
          string,
          { enrollments: number; revenue: number }
        > = {}
        enrollments.forEach((e) => {
          const date = new Date(e.enrolledAt)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const label = date.toLocaleDateString('en-IN', {
            month: 'short',
            year: '2-digit',
          })
          if (!monthlyMap[key]) monthlyMap[key] = { enrollments: 0, revenue: 0 }
          monthlyMap[key].enrollments += 1
          monthlyMap[key].revenue += e.price ?? 0
        })

        const sortedMonths = Object.entries(monthlyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6)
          .map(([key, val]) => ({
            month: new Date(key).toLocaleDateString('en-IN', {
              month: 'short',
              year: '2-digit',
            }),
            ...val,
          }))

        setEnrollmentData(sortedMonths)
        setRevenueData(sortedMonths)

        // Course popularity
        const popularity = courses.map((c) => ({
          name: c.title.length > 20 ? c.title.slice(0, 20) + '...' : c.title,
          students: enrollments.filter((e) => e.courseId === c.id).length,
        }))
        setCoursePopularity(popularity)

        // Student growth by month
        const studentMap: Record<string, number> = {}
        students.forEach((s) => {
          const date = new Date(s.createdAt)
          const label = date.toLocaleDateString('en-IN', {
            month: 'short',
            year: '2-digit',
          })
          studentMap[label] = (studentMap[label] ?? 0) + 1
        })
        setStudentGrowth(
          Object.entries(studentMap).map(([month, count]) => ({
            month,
            count,
          })),
        )

        // Completion rates
        const rates = courses.map((c) => {
          const courseEnrollments = enrollments.filter(
            (e) => e.courseId === c.id,
          )
          const completed = courseEnrollments.filter(
            (e) => e.progress === 100,
          ).length
          return {
            name: c.title.length > 20 ? c.title.slice(0, 20) + '...' : c.title,
            rate:
              courseEnrollments.length > 0
                ? Math.round((completed / courseEnrollments.length) * 100)
                : 0,
          }
        })
        setCompletionRates(rates)
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
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='grid grid-cols-2 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-64 bg-purple-100 rounded-2xl' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <div>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Analytics
        </h1>
        <p className='text-[13px] text-[#8470A8]'>
          Overview of your platform performance
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Monthly Enrollments */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-4'>
            Monthly Enrollments
          </h2>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#F3EEFF' />
              <XAxis dataKey='month' tick={{ fontSize: 11, fill: '#8470A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8470A8' }} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='enrollments'
                stroke='#7C5CBF'
                strokeWidth={2}
                dot={{ fill: '#7C5CBF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-4'>
            Monthly Revenue (₹)
          </h2>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#F3EEFF' />
              <XAxis dataKey='month' tick={{ fontSize: 11, fill: '#8470A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8470A8' }} />
              <Tooltip
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              <Bar dataKey='revenue' fill='#7C5CBF' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Popularity */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-4'>
            Course Popularity
          </h2>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie
                data={coursePopularity}
                dataKey='students'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {coursePopularity.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Student Growth */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-4'>
            Student Growth
          </h2>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={studentGrowth}>
              <CartesianGrid strokeDasharray='3 3' stroke='#F3EEFF' />
              <XAxis dataKey='month' tick={{ fontSize: 11, fill: '#8470A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8470A8' }} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='count'
                stroke='#C084F5'
                strokeWidth={2}
                dot={{ fill: '#C084F5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion Rates */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6'>
        <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-4'>
          Course Completion Rates
        </h2>
        <ResponsiveContainer width='100%' height={220}>
          <BarChart data={completionRates} layout='vertical'>
            <CartesianGrid strokeDasharray='3 3' stroke='#F3EEFF' />
            <XAxis
              type='number'
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#8470A8' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey='name'
              type='category'
              tick={{ fontSize: 11, fill: '#8470A8' }}
              width={120}
            />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey='rate' fill='#A67DD4' radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
