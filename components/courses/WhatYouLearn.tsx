import { CheckIcon } from '@/components/ui/Icons'

const LEARNINGS = [
  'How to recognise emotional patterns that hold you back',
  'How to set boundaries without guilt or fear',
  'How to let go of past pain and generational wounds',
  'How to build emotional resilience and inner strength',
  'How to choose yourself with confidence every day',
  'Tools and practices for daily emotional well-being',
]

export default function WhatYouLearn() {
  return (
    <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-7'>
      <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-5'>
        What You Will Learn
      </h3>
      <div className='grid sm:grid-cols-2 gap-3'>
        {LEARNINGS.map((item) => (
          <div key={item} className='flex items-start gap-3'>
            <div className='w-5 h-5 rounded-full bg-[#7C5CBF] flex items-center justify-center shrink-0 mt-0.5'>
              <CheckIcon size={10} className='text-white' />
            </div>
            <span className='text-[14px] text-[#4A3570] leading-snug'>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
