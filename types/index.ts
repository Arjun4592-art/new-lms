// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin'

export interface LMSUser {
  uid: string
  email: string
  name: string
  photoURL: string | null
  role: UserRole
  createdAt: string // ISO string
  enrolledCourses?: string[] // courseIds
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  instructorId: string
  instructorName: string
  category: string
  tags: string[]
  published: boolean
  createdAt: string
  totalLessons: number
  totalDuration: number // in minutes
  rating: number
  reviewCount: number
}

// ─── Section & Lesson ────────────────────────────────────────────────────────

export interface Section {
  id: string
  courseId: string
  title: string
  order: number
}

export interface Lesson {
  id: string
  courseId: string
  sectionId: string
  title: string
  videoUrl: string
  duration: number // in minutes
  order: number
  isFree: boolean // preview lesson
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  purchasedAt: string
  price: number
  progress: Record<string, boolean> // { [lessonId]: completed }
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  userId: string
  userName: string
  courseId: string
  rating: number // 1–5
  comment: string
  createdAt: string
}
