import {
  VideoIcon,
  FileTextIcon,
  UsersIcon,
  DownloadIcon,
} from '@/components/ui/Icons'

function PhoneCallIcon({
  size = 20,
  style,
}: {
  size?: number
  style?: React.CSSProperties
}) {
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
      style={style}
    >
      <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .97h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' />
    </svg>
  )
}

const iconStyle = { color: 'var(--color-primary)' }

const INCLUDES = [
  {
    icon: <VideoIcon size={18} style={iconStyle} />,
    label: 'Live Zoom Sessions',
    desc: 'Interactive group coaching calls',
  },
  {
    icon: <VideoIcon size={18} style={iconStyle} />,
    label: 'Recorded Modules',
    desc: 'Lifetime access to all videos',
  },
  {
    icon: <FileTextIcon size={18} style={iconStyle} />,
    label: 'Guided Worksheets',
    desc: 'Practical exercises & reflections',
  },
  {
    icon: <FileTextIcon size={18} style={iconStyle} />,
    label: 'Reflection Journals',
    desc: 'Daily journaling prompts',
  },
  {
    icon: <DownloadIcon size={18} style={iconStyle} />,
    label: 'Affirmation Sheets',
    desc: 'Downloadable resources',
  },
  {
    icon: <UsersIcon size={18} style={iconStyle} />,
    label: 'Community Support',
    desc: 'WhatsApp group access',
  },
  {
    icon: <PhoneCallIcon size={18} style={iconStyle} />,
    label: 'Optional 1:1 Calls',
    desc: 'Private coaching sessions',
  },
  {
    icon: <FileTextIcon size={18} style={iconStyle} />,
    label: 'Daily Practices',
    desc: 'Structured healing activities',
  },
]

export default function CourseIncludes() {
  return (
    <div
      className='rounded-xl p-7'
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      <h3
        className='font-serif text-[20px] font-medium mb-5'
        style={{ color: 'var(--color-text)' }}
      >
        What&apos;s Included
      </h3>
      <div className='grid sm:grid-cols-2 gap-4'>
        {INCLUDES.map((item) => (
          <div key={item.label} className='flex items-start gap-3'>
            <div
              className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0'
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              {item.icon}
            </div>
            <div>
              <p
                className='text-[13.5px] font-semibold'
                style={{ color: 'var(--color-text)' }}
              >
                {item.label}
              </p>
              <p
                className='text-[12px] font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
