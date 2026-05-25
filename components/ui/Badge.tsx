interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'pink' | 'green' | 'gold'
}

const styles = {
  purple: 'bg-[#F3EEFF] text-[#7C5CBF] border border-[#D4BEFF]',
  pink: 'bg-[#FFF0F6] text-[#C2557A] border border-[#F5C0D5]',
  green: 'bg-[#EDFCF2] text-[#2D7A4F] border border-[#A8E6BF]',
  gold: 'bg-[#FFFBEB] text-[#92620A] border border-[#F5D98B]',
}

export default function Badge({ children, variant = 'purple' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
