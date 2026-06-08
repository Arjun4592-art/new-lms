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

const TYPE_STYLES: Record<Resource['type'], { emoji: string; color: string }> =
  {
    PDF: { emoji: '📄', color: '#C0392B' },
    Video: { emoji: '🎬', color: '#2980B9' },
    Audio: { emoji: '🎵', color: 'var(--color-primary)' },
    Worksheet: { emoji: '📝', color: '#27AE60' },
    Other: { emoji: '📁', color: 'var(--color-primary-mid)' },
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
      className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all shrink-0 disabled:opacity-60'
      style={
        done
          ? { backgroundColor: '#DCFCE7', color: '#16A34A' }
          : {
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
            }
      }
      onMouseEnter={(e) => {
        if (!done && !downloading)
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'
      }}
      onMouseLeave={(e) => {
        if (!done && !downloading)
          e.currentTarget.style.backgroundColor = 'var(--color-primary)'
      }}
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
    <div
      className='rounded-xl overflow-hidden'
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      {/* Header */}
      <div
        className='px-6 py-4'
        style={{
          borderBottom: '1px solid var(--color-surface-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <h3
          className='font-serif text-[18px] font-medium'
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        <p
          className='text-[12.5px] mt-0.5'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          {resources.length} resources available
        </p>
      </div>

      {/* Filter tabs */}
      {types.length > 2 && (
        <div
          className='flex items-center gap-2 px-6 py-3 overflow-x-auto'
          style={{ borderBottom: '1px solid var(--color-surface-border)' }}
        >
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className='px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all border-none cursor-pointer'
              style={
                filter === type
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-bg)',
                    }
                  : {
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-primary)',
                    }
              }
              onMouseEnter={(e) => {
                if (filter !== type)
                  e.currentTarget.style.backgroundColor =
                    'var(--color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                if (filter !== type)
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className='px-6 py-12 text-center'>
          <p
            className='text-[14px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            No resources of this type yet.
          </p>
        </div>
      ) : (
        <div
          style={{ borderColor: 'var(--color-surface-border)' }}
          className='divide-y divide-surface-border'
        >
          {filtered.map((resource) => {
            const style = TYPE_STYLES[resource.type]
            return (
              <div
                key={resource.id}
                className='flex items-center gap-4 px-6 py-4 transition-colors'
                style={{
                  borderBottom: '1px solid var(--color-surface-border)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'var(--color-surface)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {/* Type icon */}
                <div
                  className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[20px]'
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  {style.emoji}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p
                      className='text-[13.5px] font-semibold truncate'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {resource.title}
                    </p>
                    {resource.isNew && (
                      <span
                        className='text-[10px] px-1.5 py-0.5 rounded-full font-bold'
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-primary)',
                          border: '1px solid var(--color-surface-border)',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p
                      className='text-[12px] mt-0.5 truncate'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {resource.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-1'>
                    <span
                      className='text-[11px] font-semibold'
                      style={{ color: style.color }}
                    >
                      {resource.type}
                    </span>
                    <span style={{ color: 'var(--color-primary-muted)' }}>
                      ·
                    </span>
                    <span
                      className='text-[11px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {resource.size}
                    </span>
                    {resource.courseTitle && (
                      <>
                        <span style={{ color: 'var(--color-primary-muted)' }}>
                          ·
                        </span>
                        <span
                          className='text-[11px] truncate'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
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

      {/* Footer */}
      <div
        className='px-6 py-3'
        style={{
          borderTop: '1px solid var(--color-surface-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <p
          className='text-[11.5px] flex items-center gap-1.5'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          🔒 Resources are for personal use only — please do not share or
          distribute.
        </p>
      </div>
    </div>
  )
}
