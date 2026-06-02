// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin'

export interface LMSUser {
  uid: string
  email: string
  name: string
  photoURL: string | null
  role: UserRole
  createdAt: string
  enrolledCourses?: string[]
  phone?: string
  emailVerified?: boolean // ← add this
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  emoji: string // ← add
  color: string // ← add
  price: number
  isFree: boolean
  instructorId: string
  instructorName: string
  category: string
  tags: string[]
  published: boolean
  createdAt: string
  totalLessons: number
  totalDuration: number
  rating: number
  reviewCount: number
  format: 'Live + Recorded' | 'Recorded' | 'Live'
  whatYouLearn?: string[]
  includes?: string[]
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
  enrolledAt: string | any // Firestore Timestamp or ISO string
  price: number
  progress: number
  completedLessons: string[]
  nextLesson?: string
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
