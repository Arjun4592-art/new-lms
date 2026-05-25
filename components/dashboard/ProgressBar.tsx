interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md'
  color?: string
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  color = 'bg-[#7C5CBF]',
}: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className='w-full'>
      {(label || showPercent) && (
        <div className='flex items-center justify-between mb-1.5'>
          {label && <span className='text-[12px] text-[#6B5B8B]'>{label}</span>}
          {showPercent && (
            <span className='text-[12px] font-semibold text-[#7C5CBF]'>
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} bg-purple-100 rounded-full overflow-hidden`}
      >
        <div
          className={`${height} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
