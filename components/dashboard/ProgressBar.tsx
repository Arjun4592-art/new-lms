interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md'
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
}: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className='w-full'>
      {(label || showPercent) && (
        <div className='flex items-center justify-between mb-1.5'>
          {label && (
            <span
              className='text-[12px]'
              style={{ color: 'var(--color-primary)' }}
            >
              {label}
            </span>
          )}
          {showPercent && (
            <span
              className='text-[12px] font-semibold'
              style={{ color: 'var(--color-primary)' }}
            >
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} rounded-full overflow-hidden`}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  )
}
