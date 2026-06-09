interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  color?: 'purple' | 'green' | 'blue' | 'orange' | 'primary'
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
}: StatCardProps) {
  // Non-brand colors kept as-is; brand colors use CSS variables
  const iconStyle: React.CSSProperties =
    color === 'primary' || color === 'purple'
      ? {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
        }
      : color === 'green'
        ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
        : color === 'blue'
          ? { backgroundColor: '#EFF6FF', color: '#2563EB' }
          : { backgroundColor: '#FFF7ED', color: '#EA580C' } // orange

  return (
    <div
      className='rounded-xl p-5'
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      <div className='flex items-center justify-between mb-4'>
        <p
          className='text-[13px] font-semibold'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          {title}
        </p>
        <div
          className='w-9 h-9 rounded-xl flex items-center justify-center'
          style={iconStyle}
        >
          {icon}
        </div>
      </div>

      <p
        className='text-[28px] font-semibold leading-none mb-1'
        style={{ color: 'var(--color-text)' }}
      >
        {value}
      </p>

      {subtitle && (
        <p
          className='text-[12px]'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          {subtitle}
        </p>
      )}

      {trend && (
        <div className='mt-3 flex items-center gap-1'>
          <span
            className='text-[12px] font-semibold'
            style={{ color: trend.value >= 0 ? '#16A34A' : '#DC2626' }}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span
            className='text-[12px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {trend.label}
          </span>
        </div>
      )}
    </div>
  )
}
