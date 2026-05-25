'use client'

import { useState } from 'react'
import { DownloadIcon, FileTextIcon } from '@/components/ui/Icons'

export interface Resource {
  id: string
  title: string
  description?: string
  type: 'PDF' | 'Worksheet' | 'Journal' | 'Affirmation' | 'Audio' | 'Guide'
  size: string
  url?: string
  isNew?: boolean
  courseTitle?: string
}

interface ResourceDownloadProps {
  resources: Resource[]
  title?: string
}

const TYPE_STYLES: Record<
  Resource['type'],
  { bg: string; text: string; emoji: string }
> = {
  PDF: { bg: 'bg-red-50', text: 'text-red-600', emoji: '📄' },
  Worksheet: { bg: 'bg-[#F3EEFF]', text: 'text-[#7C5CBF]', emoji: '📝' },
  Journal: { bg: 'bg-pink-50', text: 'text-pink-600', emoji: '📓' },
  Affirmation: { bg: 'bg-yellow-50', text: 'text-yellow-700', emoji: '✨' },
  Audio: { bg: 'bg-green-50', text: 'text-green-700', emoji: '🎧' },
  Guide: { bg: 'bg-blue-50', text: 'text-blue-600', emoji: '📘' },
}

function DownloadButton({ resource }: { resource: Resource }) {
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleDownload() {
    if (!resource.url) {
      alert('Resource coming soon!')
      return
    }
    setDownloading(true)
    // Simulate download — replace with real download logic
    await new Promise((r) => setTimeout(r, 1200))
    setDownloading(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
    window.open(resource.url, '_blank')
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all shrink-0 ${
        done
          ? 'bg-green-100 text-green-700'
          : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white'
      } disabled:opacity-60`}
    >
      {downloading ? (
        <svg
          className='animate-spin w-3.5 h-3.5'
          viewBox='0 0 24 24'
          fill='none'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8v8H4z'
          />
        </svg>
      ) : done ? (
        <>
          <svg
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='20 6 9 17 4 12' />
          </svg>
          Done!
        </>
      ) : (
        <>
          <DownloadIcon size={13} /> Download
        </>
      )}
    </button>
  )
}

export default function ResourceDownload({
  resources,
  title = 'My Resources',
}: ResourceDownloadProps) {
  const [filter, setFilter] = useState<Resource['type'] | 'All'>('All')

  const types = [
    'All',
    ...Array.from(new Set(resources.map((r) => r.type))),
  ] as (Resource['type'] | 'All')[]

  const filtered =
    filter === 'All' ? resources : resources.filter((r) => r.type === filter)

  return (
    <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-purple-100 bg-[#F9F5FF]'>
        <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E]'>
          {title}
        </h3>
        <p className='text-[12.5px] text-[#8470A8] mt-0.5'>
          {resources.length} resources available
        </p>
      </div>

      {/* Filter tabs */}
      {types.length > 2 && (
        <div className='flex items-center gap-2 px-6 py-3 border-b border-purple-50 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all border-none cursor-pointer ${
                filter === type
                  ? 'bg-[#7C5CBF] text-white'
                  : 'bg-[#F3EEFF] text-[#7C5CBF] hover:bg-[#E8DEFF]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Resource list */}
      {filtered.length === 0 ? (
        <div className='px-6 py-12 text-center'>
          <p className='text-[14px] text-[#8470A8]'>
            No resources of this type yet.
          </p>
        </div>
      ) : (
        <div className='divide-y divide-purple-50'>
          {filtered.map((resource) => {
            const style = TYPE_STYLES[resource.type]
            return (
              <div
                key={resource.id}
                className='flex items-center gap-4 px-6 py-4 hover:bg-[#FAF8FF] transition-colors'
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center shrink-0 text-[20px]`}
                >
                  {style.emoji}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                      {resource.title}
                    </p>
                    {resource.isNew && (
                      <span className='text-[10px] bg-[#F3EEFF] text-[#7C5CBF] border border-purple-200 px-1.5 py-0.5 rounded-full font-bold'>
                        NEW
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className='text-[12px] text-[#8470A8] mt-0.5 truncate'>
                      {resource.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-1'>
                    <span className={`text-[11px] font-semibold ${style.text}`}>
                      {resource.type}
                    </span>
                    <span className='text-[#D4BEFF]'>·</span>
                    <span className='text-[11px] text-[#8470A8]'>
                      {resource.size}
                    </span>
                    {resource.courseTitle && (
                      <>
                        <span className='text-[#D4BEFF]'>·</span>
                        <span className='text-[11px] text-[#8470A8] truncate'>
                          {resource.courseTitle}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Download button */}
                <DownloadButton resource={resource} />
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      <div className='px-6 py-3 border-t border-purple-50 bg-[#FAF8FF]'>
        <p className='text-[11.5px] text-[#B0A0CC] flex items-center gap-1.5'>
          <svg
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
          </svg>
          Resources are for personal use only — please do not share or
          distribute.
        </p>
      </div>
    </div>
  )
}
