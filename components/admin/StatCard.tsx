interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  color?: 'purple' | 'green' | 'blue' | 'orange'
}

const colorMap = {
  purple: 'bg-[#F3EEFF] text-[#7C5CBF]',
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'purple',
}: StatCardProps) {
  return (
    <div className='bg-white border border-purple-100 rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-[13px] font-semibold text-[#8470A8]'>{title}</p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className='text-[28px] font-bold text-[#2D1B5E] leading-none mb-1'>
        {value}
      </p>
      {subtitle && <p className='text-[12px] text-[#8470A8]'>{subtitle}</p>}
      {trend && (
        <div className='mt-3 flex items-center gap-1'>
          <span
            className={`text-[12px] font-semibold ${
              trend.value >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className='text-[12px] text-[#8470A8]'>{trend.label}</span>
        </div>
      )}
    </div>
  )
}
