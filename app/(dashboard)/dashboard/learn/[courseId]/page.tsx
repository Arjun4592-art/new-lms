import LessonPlayer, { Module } from '@/components/dashboard/LessonPlayer'
import { notFound } from 'next/navigation'

interface Props {
  params: { courseId: string }
}

const COURSE_MODULES: Record<string, { title: string; modules: Module[] }> = {
  'pain-to-power-masterclass': {
    title: 'Pain to Power Masterclass',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Understanding Your Pain',
        lessons: [
          {
            id: 'l1',
            title: 'Welcome & What to Expect',
            duration: '8 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l2',
            title: 'Understanding Emotional Pain',
            duration: '14 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l3',
            title: 'Your Pain Story Worksheet',
            duration: '10 min',
            type: 'pdf',
            isCompleted: true,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Recognising Patterns',
        lessons: [
          {
            id: 'l4',
            title: 'What Are Emotional Patterns?',
            duration: '16 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l5',
            title: 'Identifying Your Triggers',
            duration: '12 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l6',
            title: 'Pattern Mapping Exercise',
            duration: '15 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Releasing the Pain',
        lessons: [
          {
            id: 'l7',
            title: 'The Art of Letting Go',
            duration: '18 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l8',
            title: 'Somatic Release Practices',
            duration: '20 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l9',
            title: 'Live Group Session Recording',
            duration: '60 min',
            type: 'live',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Stepping Into Power',
        lessons: [
          {
            id: 'l10',
            title: 'Building Unshakeable Confidence',
            duration: '22 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l11',
            title: 'Daily Power Practices',
            duration: '12 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l12',
            title: 'Your Power Affirmations Sheet',
            duration: '5 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l13',
            title: 'Closing Ceremony & Next Steps',
            duration: '10 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
  '5-day-challenge': {
    title: '5-Day WhatsApp Challenge',
    modules: [
      {
        id: 'm1',
        title: 'Day 1: Awareness',
        lessons: [
          {
            id: 'l1',
            title: 'Welcome to the Challenge',
            duration: '5 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l2',
            title: 'Day 1 Prompt & Practice',
            duration: '10 min',
            type: 'pdf',
            isCompleted: true,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Day 2: Emotions',
        lessons: [
          {
            id: 'l3',
            title: 'Understanding Your Emotions',
            duration: '8 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l4',
            title: 'Day 2 Journal Prompts',
            duration: '10 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Day 3: Boundaries',
        lessons: [
          {
            id: 'l5',
            title: 'What Are Boundaries?',
            duration: '10 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l6',
            title: 'Day 3 Practice',
            duration: '8 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm4',
        title: 'Day 4: Self-Worth',
        lessons: [
          {
            id: 'l7',
            title: 'Reclaiming Your Worth',
            duration: '12 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l8',
            title: 'Day 4 Affirmations',
            duration: '5 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
      {
        id: 'm5',
        title: 'Day 5: Power',
        lessons: [
          {
            id: 'l9',
            title: 'Stepping Into Your Power',
            duration: '15 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l10',
            title: 'Closing Reflection',
            duration: '8 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
  '4-week-healing': {
    title: '4-Week Emotional Healing Programme',
    modules: [
      {
        id: 'm1',
        title: 'Week 1: Foundation',
        lessons: [
          {
            id: 'l1',
            title: 'Orientation & Welcome',
            duration: '10 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l2',
            title: 'Week 1 Live Zoom Session',
            duration: '60 min',
            type: 'live',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l3',
            title: 'Foundation Workbook',
            duration: '20 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Week 2: Healing',
        lessons: [
          {
            id: 'l4',
            title: 'Deep Healing Practices',
            duration: '25 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l5',
            title: 'Week 2 Live Zoom Session',
            duration: '60 min',
            type: 'live',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l6',
            title: 'Healing Journal Prompts',
            duration: '15 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Week 3: Boundaries',
        lessons: [
          {
            id: 'l7',
            title: 'Boundaries from Love',
            duration: '20 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l8',
            title: 'Week 3 Live Zoom Session',
            duration: '60 min',
            type: 'live',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
      {
        id: 'm4',
        title: 'Week 4: Power',
        lessons: [
          {
            id: 'l9',
            title: 'Rising Into Your Power',
            duration: '22 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l10',
            title: 'Final Live Zoom + Celebration',
            duration: '90 min',
            type: 'live',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l11',
            title: 'Certificate of Completion',
            duration: '2 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
  'self-boundaries': {
    title: 'Self-Boundaries & Letting Go',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: What Are Boundaries?',
        lessons: [
          {
            id: 'l1',
            title: 'Introduction to Boundaries',
            duration: '12 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l2',
            title: 'Types of Boundaries',
            duration: '10 min',
            type: 'video',
            isCompleted: true,
            isLocked: false,
          },
          {
            id: 'l3',
            title: 'Boundary Assessment Worksheet',
            duration: '15 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Setting Boundaries Without Guilt',
        lessons: [
          {
            id: 'l4',
            title: 'The Guilt Around Boundaries',
            duration: '14 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l5',
            title: 'Scripts for Setting Boundaries',
            duration: '10 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Letting Go',
        lessons: [
          {
            id: 'l6',
            title: 'The Art of Letting Go',
            duration: '18 min',
            type: 'video',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l7',
            title: 'Letting Go Ritual Practice',
            duration: '12 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Living Free',
        lessons: [
          {
            id: 'l8',
            title: 'Your New Empowered Life',
            duration: '15 min',
            type: 'video',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l9',
            title: 'Daily Freedom Affirmations',
            duration: '5 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
  'healing-workshops': {
    title: 'Recorded Healing Workshops',
    modules: [
      {
        id: 'm1',
        title: 'Workshop 1: Inner Child Healing',
        lessons: [
          {
            id: 'l1',
            title: 'Inner Child Healing Workshop',
            duration: '75 min',
            type: 'live',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l2',
            title: 'Inner Child Letter Worksheet',
            duration: '20 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Workshop 2: Emotional Resilience',
        lessons: [
          {
            id: 'l3',
            title: 'Building Emotional Resilience',
            duration: '80 min',
            type: 'live',
            isCompleted: false,
            isLocked: false,
          },
          {
            id: 'l4',
            title: 'Resilience Daily Practice Guide',
            duration: '10 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Workshop 3: Self-Worth',
        lessons: [
          {
            id: 'l5',
            title: 'Reclaiming Your Self-Worth',
            duration: '70 min',
            type: 'live',
            isCompleted: false,
            isLocked: true,
          },
          {
            id: 'l6',
            title: 'Self-Worth Affirmation Sheet',
            duration: '5 min',
            type: 'pdf',
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(COURSE_MODULES).map((courseId) => ({ courseId }))
}

export default function LearnPage({ params }: Props) {
  const data = COURSE_MODULES[params.courseId]
  if (!data) notFound()

  return (
    <div className='space-y-5 max-w-6xl mx-auto'>
      {/* Header */}
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Now Learning
        </p>
        <h1 className='font-serif text-[24px] sm:text-[28px] font-bold text-[#2D1B5E]'>
          {data.title}
        </h1>
      </div>

      {/* Player */}
      <LessonPlayer modules={data.modules} courseTitle={data.title} />
    </div>
  )
}
