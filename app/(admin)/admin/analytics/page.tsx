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
} from 'recharts'
import type { Course, Enrollment, LMSUser } from '@/types'

// Earthy palette for charts
const CHART_COLORS = ['#7a6a58', '#5c4a38', '#b8a898', '#2c2218', '#d8cebc']
const CHART_LINE = '#7a6a58'
const CHART_LINE2 = '#b8a898'
const CHART_BAR = '#7a6a58'
const CHART_BAR2 = '#b8a898'
const CHART_GRID = '#e8dfd0'
const CHART_TICK = '#b8a898'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [enrollmentData, setEnrollmentData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [coursePopularity, setCoursePopularity] = useState<any[]>([])
  const [studentGrowth, setStudentGrowth] = useState<any[]>([])
  const [completionRates, setCompletionRates] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
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

        // Monthly enrollment + revenue
        const monthlyMap: Record<
          string,
          { enrollments: number; revenue: number }
        > = {}
        enrollments.forEach((e) => {
          const date = new Date(e.enrolledAt)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
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
        setCoursePopularity(
          courses.map((c) => ({
            name: c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title,
            students: enrollments.filter((e) => e.courseId === c.id).length,
          })),
        )

        // Student growth
        const studentMap: Record<string, number> = {}
        students.forEach((s) => {
          const label = new Date(s.createdAt).toLocaleDateString('en-IN', {
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
        setCompletionRates(
          courses.map((c) => {
            const ce = enrollments.filter((e) => e.courseId === c.id)
            const completed = ce.filter((e) => e.progress === 100).length
            return {
              name: c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title,
              rate:
                ce.length > 0 ? Math.round((completed / ce.length) * 100) : 0,
            }
          }),
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse max-w-6xl mx-auto'>
        <div
          className='h-10 w-48 rounded'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div className='grid lg:grid-cols-2 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-64 rounded-xl'
              style={{ backgroundColor: 'var(--color-surface)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  const cardStyle = {
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-surface-border)',
    borderRadius: 12,
    padding: 24,
  }

  const titleStyle = {
    fontFamily: 'var(--font-serif)',
    fontSize: 16,
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: 16,
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <div>
        <h1
          className='font-serif text-[26px] font-medium'
          style={{ color: 'var(--color-text)' }}
        >
          Analytics
        </h1>
        <p
          className='text-[13px]'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          Overview of your platform performance
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Monthly Enrollments */}
        <div style={cardStyle}>
          <p style={titleStyle}>Monthly Enrollments</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray='3 3' stroke={CHART_GRID} />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 11, fill: CHART_TICK }}
              />
              <YAxis tick={{ fontSize: 11, fill: CHART_TICK }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${CHART_GRID}`,
                  fontSize: 12,
                }}
              />
              <Line
                type='monotone'
                dataKey='enrollments'
                stroke={CHART_LINE}
                strokeWidth={2}
                dot={{ fill: CHART_LINE }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div style={cardStyle}>
          <p style={titleStyle}>Monthly Revenue (₹)</p>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray='3 3' stroke={CHART_GRID} />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 11, fill: CHART_TICK }}
              />
              <YAxis tick={{ fontSize: 11, fill: CHART_TICK }} />
              <Tooltip
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${CHART_GRID}`,
                  fontSize: 12,
                }}
              />
              <Bar dataKey='revenue' fill={CHART_BAR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Popularity */}
        <div style={cardStyle}>
          <p style={titleStyle}>Course Popularity</p>
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
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${CHART_GRID}`,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Student Growth */}
        <div style={cardStyle}>
          <p style={titleStyle}>Student Growth</p>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={studentGrowth}>
              <CartesianGrid strokeDasharray='3 3' stroke={CHART_GRID} />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 11, fill: CHART_TICK }}
              />
              <YAxis tick={{ fontSize: 11, fill: CHART_TICK }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${CHART_GRID}`,
                  fontSize: 12,
                }}
              />
              <Line
                type='monotone'
                dataKey='count'
                stroke={CHART_LINE2}
                strokeWidth={2}
                dot={{ fill: CHART_LINE2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion Rates */}
      <div style={cardStyle}>
        <p style={titleStyle}>Course Completion Rates</p>
        <ResponsiveContainer width='100%' height={220}>
          <BarChart data={completionRates} layout='vertical'>
            <CartesianGrid strokeDasharray='3 3' stroke={CHART_GRID} />
            <XAxis
              type='number'
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: CHART_TICK }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey='name'
              type='category'
              tick={{ fontSize: 11, fill: CHART_TICK }}
              width={120}
            />
            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${CHART_GRID}`,
                fontSize: 12,
              }}
            />
            <Bar dataKey='rate' fill={CHART_BAR2} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
