import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

const courses = [
  // ── 1. Pain to Power Masterclass ──────────────────────────────
  {
    id: 'pain-to-power-masterclass',
    title: 'Pain to Power Masterclass',
    description:
      'A transformational masterclass designed to help you identify emotional patterns, release suppressed pain, and step into confidence with clarity and strength.',
    thumbnail: '',
    emoji: '✨',
    color: '#7C3AED',
    price: 0,
    isFree: true,
    instructorId: 'masuma',
    instructorName: 'Masuma',
    category: 'Emotional Healing',
    tags: ['healing', 'confidence', 'self-worth', 'masterclass'],
    published: true,
    createdAt: new Date().toISOString(),
    totalLessons: 1,
    totalDuration: 90,
    rating: 0,
    reviewCount: 0,
    format: 'Live + Recorded',
    whatYouLearn: [
      'How to recognize emotional patterns',
      'How to set boundaries without guilt',
      'How to let go of past pain',
      'How to build emotional resilience',
      'How to choose yourself with confidence',
    ],
    includes: [
      'Live 60–90 min workshop',
      'Recorded replay access',
      'Guided worksheet',
      'Affirmation sheet',
    ],
  },

  // ── 2. 4-Week Emotional Healing Programme ─────────────────────
  {
    id: '4-week-emotional-healing',
    title: '4-Week Emotional Healing Programme',
    description:
      'A 4-session deep transformation journey — from awareness to rising into your personal power. Heal your past, rebuild self-worth, and step into the strongest version of you.',
    thumbnail: '',
    emoji: '🌸',
    color: '#C084FC',
    price: 0,
    isFree: false,
    instructorId: 'masuma',
    instructorName: 'Masuma',
    category: 'Emotional Healing',
    tags: ['4-week', 'healing', 'self-worth', 'boundaries', 'transformation'],
    published: true,
    createdAt: new Date().toISOString(),
    totalLessons: 4,
    totalDuration: 240,
    rating: 0,
    reviewCount: 0,
    format: 'Live + Recorded',
    whatYouLearn: [
      'How to identify where self-doubt begins',
      'How to release emotional baggage and forgive',
      'How to rebuild self-worth and inner beliefs',
      'How to set healthy boundaries confidently',
      'How to make confident decisions and create a new life',
    ],
    includes: [
      '4 live 1:1 sessions',
      'Guided worksheets',
      'Reflection journals',
      'Affirmation sheets',
      'WhatsApp support',
    ],
  },

  // ── 3. 8-Week Deep Integration Journey ────────────────────────
  {
    id: '8-week-deep-integration',
    title: '8-Week Deep Integration Journey',
    description:
      'A comprehensive 8-week programme for deep emotional healing, rebuilding self-trust, and setting healthy boundaries — with live sessions, guided practices, and weekly homework.',
    thumbnail: '',
    emoji: '🔮',
    color: '#6D28D9',
    price: 0,
    isFree: false,
    instructorId: 'masuma',
    instructorName: 'Masuma',
    category: 'Emotional Healing',
    tags: ['8-week', 'deep-healing', 'boundaries', 'self-trust', 'integration'],
    published: true,
    createdAt: new Date().toISOString(),
    totalLessons: 8,
    totalDuration: 480,
    rating: 0,
    reviewCount: 0,
    format: 'Live + Recorded',
    whatYouLearn: [
      'Understanding self-worth and emotional patterns',
      'Recognizing and releasing emotional triggers',
      'Healing past wounds and releasing resentment',
      'Reframing negative self-talk and self-blame',
      'Rebuilding self-trust and inner confidence',
      'Setting healthy boundaries in relationships',
      'Building emotional resilience and energy protection',
      'Creating lasting change through daily practices',
    ],
    includes: [
      '8 live group sessions on Zoom',
      'Recorded modules',
      'Guided worksheets per week',
      'Reflection journals',
      'Daily practices & affirmation sheets',
      'WhatsApp community support',
    ],
  },
]

// ── Sections for 4-Week ───────────────────────────────────────────────────────
const sections4Week = [
  {
    id: 'sec-4w-1',
    courseId: '4-week-emotional-healing',
    title: 'Session 1 — Awareness: Understanding Your Story',
    order: 1,
  },
  {
    id: 'sec-4w-2',
    courseId: '4-week-emotional-healing',
    title: 'Session 2 — Release: Letting Go of the Past',
    order: 2,
  },
  {
    id: 'sec-4w-3',
    courseId: '4-week-emotional-healing',
    title: 'Session 3 — Re-Set: Rebuilding Self-Worth',
    order: 3,
  },
  {
    id: 'sec-4w-4',
    courseId: '4-week-emotional-healing',
    title: 'Session 4 — Rise: Stepping into Personal Power',
    order: 4,
  },
]

// ── Sections for 8-Week ───────────────────────────────────────────────────────
const sections8Week = [
  {
    id: 'sec-8w-1',
    courseId: '8-week-deep-integration',
    title: 'Week 1 — Awakening Awareness',
    order: 1,
  },
  {
    id: 'sec-8w-2',
    courseId: '8-week-deep-integration',
    title: 'Week 2 — Meeting Your Inner Story',
    order: 2,
  },
  {
    id: 'sec-8w-3',
    courseId: '8-week-deep-integration',
    title: 'Week 3 — Understanding Emotional Triggers',
    order: 3,
  },
  {
    id: 'sec-8w-4',
    courseId: '8-week-deep-integration',
    title: 'Week 4 — Healing the Past',
    order: 4,
  },
  {
    id: 'sec-8w-5',
    courseId: '8-week-deep-integration',
    title: 'Week 5 — Letting Go of Self-Blame',
    order: 5,
  },
  {
    id: 'sec-8w-6',
    courseId: '8-week-deep-integration',
    title: 'Week 6 — Resetting Your Inner Dialogue',
    order: 6,
  },
  {
    id: 'sec-8w-7',
    courseId: '8-week-deep-integration',
    title: 'Week 7 — Rebuilding Self-Trust',
    order: 7,
  },
  {
    id: 'sec-8w-8',
    courseId: '8-week-deep-integration',
    title: 'Week 8 — Setting Healthy Boundaries',
    order: 8,
  },
]

async function seed() {
  console.log('🌱 Seeding courses...')

  // Add courses
  for (const course of courses) {
    await db.collection('courses').doc(course.id).set(course)
    console.log(`✅ Course added: ${course.title}`)
  }

  // Add 4-week sections
  for (const section of sections4Week) {
    await db.collection('sections').doc(section.id).set(section)
    console.log(`✅ Section added: ${section.title}`)
  }

  // Add 8-week sections
  for (const section of sections8Week) {
    await db.collection('sections').doc(section.id).set(section)
    console.log(`✅ Section added: ${section.title}`)
  }

  console.log('🎉 All done!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
