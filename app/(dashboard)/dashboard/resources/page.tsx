import ResourceDownload, { Resource } from '@/components/dashboard/ResourceDownload'
import SectionHeading from '@/components/ui/SectionHeading'

const RESOURCES: Resource[] = [
  // Pain to Power Masterclass
  {
    id: 'r1',
    title: 'Your Pain Story Worksheet',
    description: 'Guided questions to help you identify and articulate your emotional pain',
    type: 'Worksheet',
    size: '1.2 MB',
    courseTitle: 'Pain to Power Masterclass',
    isNew: false,
  },
  {
    id: 'r2',
    title: 'Emotional Pattern Mapping Exercise',
    description: 'Visual tool to map your emotional triggers and recurring patterns',
    type: 'Worksheet',
    size: '0.9 MB',
    courseTitle: 'Pain to Power Masterclass',
    isNew: false,
  },
  {
    id: 'r3',
    title: 'Power Affirmations Sheet',
    description: '30 powerful affirmations to reprogram your mindset daily',
    type: 'Affirmation',
    size: '0.5 MB',
    courseTitle: 'Pain to Power Masterclass',
    isNew: true,
  },
  // 4-Week Healing Programme
  {
    id: 'r4',
    title: 'Week 1 Foundation Workbook',
    description: 'Complete workbook for Week 1 of the healing programme',
    type: 'Journal',
    size: '2.4 MB',
    courseTitle: '4-Week Healing Programme',
    isNew: false,
  },
  {
    id: 'r5',
    title: 'Week 2 Healing Journal Prompts',
    description: 'Daily journal prompts to deepen your healing process',
    type: 'Journal',
    size: '1.1 MB',
    courseTitle: '4-Week Healing Programme',
    isNew: false,
  },
  // Self-Boundaries Course
  {
    id: 'r6',
    title: 'Boundary Assessment Worksheet',
    description: 'Identify where your boundaries are weak and where to start',
    type: 'Worksheet',
    size: '0.8 MB',
    courseTitle: 'Self-Boundaries & Letting Go',
    isNew: false,
  },
  {
    id: 'r7',
    title: 'Scripts for Setting Boundaries',
    description: 'Word-for-word scripts to set boundaries confidently in real situations',
    type: 'Guide',
    size: '1.3 MB',
    courseTitle: 'Self-Boundaries & Letting Go',
    isNew: true,
  },
  {
    id: 'r8',
    title: 'Letting Go Ritual Practice Guide',
    description: 'Step-by-step ritual to energetically and emotionally release the past',
    type: 'Guide',
    size: '0.7 MB',
    courseTitle: 'Self-Boundaries & Letting Go',
    isNew: false,
  },
  {
    id: 'r9',
    title: 'Daily Freedom Affirmations',
    description: '21 affirmations for living a boundary-full, free life',
    type: 'Affirmation',
    size: '0.4 MB',
    courseTitle: 'Self-Boundaries & Letting Go',
    isNew: false,
  },
  // Healing Workshops
  {
    id: 'r10',
    title: 'Inner Child Letter Worksheet',
    description: 'Write a compassionate letter to your inner child for deep healing',
    type: 'Worksheet',
    size: '0.6 MB',
    courseTitle: 'Healing Workshops',
    isNew: false,
  },
  {
    id: 'r11',
    title: 'Resilience Daily Practice Guide',
    description: '7-day guide to build emotional resilience through daily micro-practices',
    type: 'Guide',
    size: '1.0 MB',
    courseTitle: 'Healing Workshops',
    isNew: true,
  },
  {
    id: 'r12',
    title: 'Self-Worth Affirmation Sheet',
    description: 'Powerful affirmations to reclaim your worth and value',
    type: 'Affirmation',
    size: '0.4 MB',
    courseTitle: 'Healing Workshops',
    isNew: false,
  },
]

export default function ResourcesPage() {
  const newCount = RESOURCES.filter((r) => r.isNew).length

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>Student Portal</p>
          <h1 className='font-serif text-[26px] sm:text-[30px] font-bold text-[#2D1B5E]'>My Resources</h1>
          <p className='text-[14px] text-[#8470A8] mt-1'>{RESOURCES.length} resources · {newCount} new</p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {[
          { label: 'Worksheets',   count: RESOURCES.filter((r) => r.type === 'Worksheet').length,   emoji: '📝' },
          { label: 'Journals',     count: RESOURCES.filter((r) => r.type === 'Journal').length,     emoji: '📓' },
          { label: 'Affirmations', count: RESOURCES.filter((r) => r.type === 'Affirmation').length, emoji: '✨' },
          { label: 'Guides',       count: RESOURCES.filter((r) => r.type === 'Guide').length,       emoji: '📘' },
        ].map((stat) => (
          <div key={stat.label} className='bg-white border border-purple-100 rounded-2xl p-4 text-center'>
            <span className='text-[24px]'>{stat.emoji}</span>
            <p className='font-serif text-[22px] font-bold text-[#2D1B5E] mt-1'>{stat.count}</p>
            <p className='text-[12px] text-[#8470A8]'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* New resources banner */}
      {newCount > 0 && (
        <div className='bg-gradient-to-r from-[#F3EEFF] to-[#FDF4FF] border border-purple-200 rounded-2xl p-5 flex items-center gap-4'>
          <span className='text-[32px]'>🎁</span>
          <div>
            <p className='font-semibold text-[#2D1B5E] text-[15px]'>{newCount} new resource{newCount > 1 ? 's' : ''} added!</p>
            <p className='text-[13px] text-[#8470A8]'>Check the NEW badge below to find the latest additions to your library.</p>
          </div>
        </div>
      )}

      {/* Resource list */}
      <ResourceDownload resources={RESOURCES} title='All Resources' />

      {/* Note */}
      <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-5 text-center'>
        <p className='text-[14px] text-[#6B5B8B] leading-relaxed'>
          🌸 New resources are added regularly as you progress through your courses. <br className='hidden sm:block' />
          If you need a specific resource, reach out to Masuma directly.
        </p>
      </div>
    </div>
  )
}