'use client'

import { useState } from 'react'
import { DownloadIcon } from '@/components/ui/Icons'

interface Resource {
  id: string
  title: string
  description?: string
  type: 'PDF' | 'Video' | 'Audio' | 'Worksheet' | 'Other'
  size: string
  url?: string
  courseTitle?: string
  isNew?: boolean
}

const TYPE_STYLES = {
  PDF: { bg: 'bg-red-50', text: 'text-red-600', emoji: '📄' },
  Video: { bg: 'bg-blue-50', text: 'text-blue-600', emoji: '🎬' },
  Audio: { bg: 'bg-purple-50', text: 'text-primary', emoji: '🎵' },
  Worksheet: { bg: 'bg-green-50', text: 'text-green-600', emoji: '📝' },
  Other: { bg: 'bg-surface', text: 'text-primary-mid', emoji: '📁' },
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all shrink-0 disabled:opacity-60 ${
        done
          ? 'bg-green-100 text-green-700'
          : 'bg-primary hover:bg-primary-hover text-white'
      }`}
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
          </svg>{' '}
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
}: {
  resources: Resource[]
  title?: string
}) {
  const [filter, setFilter] = useState<Resource['type'] | 'All'>('All')
  const types = [
    'All',
    ...Array.from(new Set(resources.map((r) => r.type))),
  ] as (Resource['type'] | 'All')[]
  const filtered =
    filter === 'All' ? resources : resources.filter((r) => r.type === filter)

  return (
    <div className='bg-white border border-surface-border rounded-2xl overflow-hidden'>
      <div className='px-6 py-4 border-b border-surface-border bg-surface'>
        <h3 className='font-serif text-[18px] font-bold text-primary-dark'>
          {title}
        </h3>
        <p className='text-[12.5px] text-primary-muted mt-0.5'>
          {resources.length} resources available
        </p>
      </div>

      {types.length > 2 && (
        <div className='flex items-center gap-2 px-6 py-3 border-b border-surface-border overflow-x-auto'>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-surface text-primary hover:bg-surface-hover'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className='px-6 py-12 text-center'>
          <p className='text-[14px] text-primary-muted'>
            No resources of this type yet.
          </p>
        </div>
      ) : (
        <div className='divide-y divide-surface-border'>
          {filtered.map((resource) => {
            const style = TYPE_STYLES[resource.type]
            return (
              <div
                key={resource.id}
                className='flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors'
              >
                <div
                  className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center shrink-0 text-[20px]`}
                >
                  {style.emoji}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                      {resource.title}
                    </p>
                    {resource.isNew && (
                      <span className='text-[10px] bg-surface text-primary border border-primary-light px-1.5 py-0.5 rounded-full font-bold'>
                        NEW
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className='text-[12px] text-primary-muted mt-0.5 truncate'>
                      {resource.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-1'>
                    <span className={`text-[11px] font-semibold ${style.text}`}>
                      {resource.type}
                    </span>
                    <span className='text-primary-light'>·</span>
                    <span className='text-[11px] text-primary-muted'>
                      {resource.size}
                    </span>
                    {resource.courseTitle && (
                      <>
                        <span className='text-primary-light'>·</span>
                        <span className='text-[11px] text-primary-muted truncate'>
                          {resource.courseTitle}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <DownloadButton resource={resource} />
              </div>
            )
          })}
        </div>
      )}

      <div className='px-6 py-3 border-t border-surface-border bg-surface'>
        <p className='text-[11.5px] text-primary-muted flex items-center gap-1.5'>
          🔒 Resources are for personal use only — please do not share or
          distribute.
        </p>
      </div>
    </div>
  )
}
