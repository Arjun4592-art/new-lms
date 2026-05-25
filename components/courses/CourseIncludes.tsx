import {
  VideoIcon,
  FileTextIcon,
  UsersIcon,
  DownloadIcon,
} from '@/components/ui/Icons'

// Add PhoneIcon to Icons.tsx if needed; using a simple inline SVG fallback
function PhoneCallIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .97h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' />
    </svg>
  )
}

const INCLUDES = [
  {
    icon: <VideoIcon size={18} />,
    label: 'Live Zoom Sessions',
    desc: 'Interactive group coaching calls',
  },
  {
    icon: <VideoIcon size={18} />,
    label: 'Recorded Modules',
    desc: 'Lifetime access to all videos',
  },
  {
    icon: <FileTextIcon size={18} />,
    label: 'Guided Worksheets',
    desc: 'Practical exercises & reflections',
  },
  {
    icon: <FileTextIcon size={18} />,
    label: 'Reflection Journals',
    desc: 'Daily journaling prompts',
  },
  {
    icon: <DownloadIcon size={18} />,
    label: 'Affirmation Sheets',
    desc: 'Downloadable resources',
  },
  {
    icon: <UsersIcon size={18} />,
    label: 'Community Support',
    desc: 'WhatsApp group access',
  },
  {
    icon: <PhoneCallIcon size={18} />,
    label: 'Optional 1:1 Calls',
    desc: 'Private coaching sessions',
  },
  {
    icon: <FileTextIcon size={18} />,
    label: 'Daily Practices',
    desc: 'Structured healing activities',
  },
]

export default function CourseIncludes() {
  return (
    <div className='bg-white border border-purple-100 rounded-2xl p-7'>
      <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-5'>
        What's Included
      </h3>
      <div className='grid sm:grid-cols-2 gap-4'>
        {INCLUDES.map((item) => (
          <div key={item.label} className='flex items-start gap-3'>
            <div className='w-9 h-9 rounded-xl bg-[#F3EEFF] flex items-center justify-center text-[#7C5CBF] shrink-0'>
              {item.icon}
            </div>
            <div>
              <p className='text-[13.5px] font-semibold text-[#2D1B5E]'>
                {item.label}
              </p>
              <p className='text-[12px] text-[#8470A8]'>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
