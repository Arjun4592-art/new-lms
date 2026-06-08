'use client'

import { useState } from 'react'
import { PlayIcon, CheckIcon, ClockIcon } from '@/components/ui/Icons'

export interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl?: string
  isCompleted: boolean
  isLocked: boolean
  type: 'video' | 'pdf' | 'live'
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface LessonPlayerProps {
  modules: Module[]
  courseTitle: string
}

function LockIconSVG({ size = 14 }: { size?: number }) {
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
    >
      <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
      <path d='M7 11V7a5 5 0 0110 0v4' />
    </svg>
  )
}

function TypeIcon({ type }: { type: Lesson['type'] }) {
  if (type === 'pdf')
    return (
      <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' />
        <polyline points='14 2 14 8 20 8' />
      </svg>
    )
  if (type === 'live')
    return (
      <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='2' />
        <path d='M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49' />
      </svg>
    )
  return <PlayIcon size={13} />
}

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div
      className='w-full aspect-video rounded-xl flex flex-col items-center justify-center'
      style={{
        background:
          'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-mid) 100%)',
      }}
    >
      <div
        className='w-16 h-16 rounded-full flex items-center justify-center mb-4'
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <PlayIcon
          size={28}
          style={{ color: 'var(--color-primary-light)', marginLeft: '3px' }}
        />
      </div>
      <p
        className='font-serif text-[18px] font-medium text-center px-6'
        style={{ color: 'var(--color-primary-light)' }}
      >
        {title}
      </p>
      <p
        className='text-[13px] mt-2'
        style={{ color: 'var(--color-primary-muted)' }}
      >
        Click to play lesson
      </p>
    </div>
  )
}

export default function LessonPlayer({
  modules,
  courseTitle,
}: LessonPlayerProps) {
  const allLessons = modules.flatMap((m) => m.lessons)
  const firstUnlocked = allLessons.find((l) => !l.isLocked)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    firstUnlocked ?? null,
  )
  const [openModules, setOpenModules] = useState<string[]>([
    modules[0]?.id ?? '',
  ])
  const [completed, setCompleted] = useState<string[]>(
    allLessons.filter((l) => l.isCompleted).map((l) => l.id),
  )

  const totalLessons = allLessons.length
  const completedCount = completed.length
  const progress = Math.round((completedCount / totalLessons) * 100)

  function toggleModule(id: string) {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    )
  }

  function markComplete(lessonId: string) {
    setCompleted((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId],
    )
  }

  return (
    <>
      <style>{`
        .lp-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 20px;
        }
        .lp-mark-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: background-color 0.2s;
        }
        .lp-mark-btn.done {
          background-color: #DCFCE7; color: #16A34A; cursor: default;
        }
        .lp-mark-btn.pending {
          background-color: var(--color-primary); color: var(--color-bg);
        }
        .lp-mark-btn.pending:hover { background-color: var(--color-primary-hover); }

        .lp-progress-bar {
          height: 8px; border-radius: 9999px; overflow: hidden;
          background-color: var(--color-surface);
        }
        .lp-progress-fill {
          height: 100%; border-radius: 9999px;
          background-color: var(--color-primary);
          transition: width 0.5s ease;
        }

        /* Sidebar */
        .lp-sidebar {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
        }
        .lp-sidebar-header {
          padding: 14px 20px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
        }
        .lp-module-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; background: transparent; border: none; cursor: pointer;
          text-align: left; transition: background-color 0.15s;
        }
        .lp-module-btn:hover { background-color: var(--color-surface); }
        .lp-lesson-btn {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 10px 20px; background: transparent; border: none; cursor: pointer;
          text-align: left; transition: background-color 0.15s;
        }
        .lp-lesson-btn.active { background-color: var(--color-primary-light); }
        .lp-lesson-btn:not(.active):not(:disabled):hover { background-color: var(--color-surface); }
        .lp-lesson-btn:disabled { cursor: not-allowed; opacity: 0.5; }

        .lp-lesson-dot {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-lesson-dot.done { background-color: #DCFCE7; color: #16A34A; }
        .lp-lesson-dot.active { background-color: var(--color-primary); color: var(--color-bg); }
        .lp-lesson-dot.locked { background-color: var(--color-surface); color: var(--color-primary-muted); }
        .lp-lesson-dot.default { background-color: var(--color-surface); color: var(--color-primary); }
      `}</style>

      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        {/* ── Video area ── */}
        <div className='flex-1 min-w-0 space-y-4'>
          {activeLesson ? (
            <>
              {/* Player */}
              {activeLesson.videoUrl ? (
                <div className='w-full aspect-video rounded-xl overflow-hidden bg-black'>
                  <iframe
                    src={activeLesson.videoUrl}
                    className='w-full h-full'
                    allowFullScreen
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  />
                </div>
              ) : (
                <VideoPlaceholder title={activeLesson.title} />
              )}

              {/* Lesson info */}
              <div className='lp-card'>
                <div className='flex items-start justify-between gap-4 flex-wrap'>
                  <div>
                    <h2
                      className='font-serif text-[20px] font-medium mb-1'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {activeLesson.title}
                    </h2>
                    <div
                      className='flex items-center gap-3 text-[13px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      <div className='flex items-center gap-1'>
                        <ClockIcon
                          size={13}
                          style={{ color: 'var(--color-primary)' }}
                        />
                        {activeLesson.duration}
                      </div>
                      <div className='flex items-center gap-1'>
                        <TypeIcon type={activeLesson.type} />
                        {activeLesson.type}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => markComplete(activeLesson.id)}
                    disabled={completed.includes(activeLesson.id)}
                    className={`lp-mark-btn ${completed.includes(activeLesson.id) ? 'done' : 'pending'}`}
                  >
                    <CheckIcon size={14} />
                    {completed.includes(activeLesson.id)
                      ? 'Completed'
                      : 'Mark Complete'}
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className='lp-card'>
                <div className='flex items-center justify-between mb-2'>
                  <p
                    className='text-[13px] font-semibold'
                    style={{ color: 'var(--color-primary-mid)' }}
                  >
                    Course Progress
                  </p>
                  <p
                    className='text-[13px] font-semibold'
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {completedCount}/{totalLessons} lessons · {progress}%
                  </p>
                </div>
                <div className='lp-progress-bar'>
                  <div
                    className='lp-progress-fill'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className='lp-card p-12 text-center'>
              <div className='text-[48px] mb-4'>🌿</div>
              <h3
                className='font-serif text-[20px] font-medium mb-2'
                style={{ color: 'var(--color-text)' }}
              >
                Select a lesson to begin
              </h3>
              <p
                className='text-[14px] font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Choose a lesson from the curriculum on the right.
              </p>
            </div>
          )}
        </div>

        {/* ── Curriculum sidebar ── */}
        <div className='lg:w-[320px] shrink-0'>
          <div className='lp-sidebar sticky top-24'>
            <div className='lp-sidebar-header'>
              <h3
                className='font-serif text-[15px] font-medium'
                style={{ color: 'var(--color-text)' }}
              >
                Course Curriculum
              </h3>
              <p
                className='text-[12px] mt-0.5'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                {completedCount}/{totalLessons} completed
              </p>
            </div>

            <div className='overflow-y-auto max-h-130 scrollbar-none [&::-webkit-scrollbar]:hidden'>
              {modules.map((mod) => {
                const isOpen = openModules.includes(mod.id)
                const modCompleted = mod.lessons.filter((l) =>
                  completed.includes(l.id),
                ).length

                return (
                  <div
                    key={mod.id}
                    style={{
                      borderBottom: '1px solid var(--color-surface-border)',
                    }}
                    className='last:border-0'
                  >
                    {/* Module header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className='lp-module-btn'
                    >
                      <div>
                        <p
                          className='text-[13px] font-semibold'
                          style={{ color: 'var(--color-text)' }}
                        >
                          {mod.title}
                        </p>
                        <p
                          className='text-[11px] mt-0.5'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
                          {modCompleted}/{mod.lessons.length} done
                        </p>
                      </div>
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='var(--color-primary-muted)'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='shrink-0 transition-transform duration-200'
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <polyline points='6 9 12 15 18 9' />
                      </svg>
                    </button>

                    {/* Lessons */}
                    {isOpen && (
                      <div
                        style={{ borderTop: '1px solid var(--color-surface)' }}
                      >
                        {mod.lessons.map((lesson) => {
                          const isActive = activeLesson?.id === lesson.id
                          const isDone = completed.includes(lesson.id)

                          return (
                            <button
                              key={lesson.id}
                              onClick={() =>
                                !lesson.isLocked && setActiveLesson(lesson)
                              }
                              disabled={lesson.isLocked}
                              className={`lp-lesson-btn ${isActive ? 'active' : ''}`}
                            >
                              <div
                                className={`lp-lesson-dot ${isDone ? 'done' : isActive ? 'active' : lesson.isLocked ? 'locked' : 'default'}`}
                              >
                                {isDone ? (
                                  <CheckIcon size={11} />
                                ) : lesson.isLocked ? (
                                  <LockIconSVG size={11} />
                                ) : (
                                  <TypeIcon type={lesson.type} />
                                )}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <p
                                  className='text-[12.5px] font-medium truncate'
                                  style={{
                                    color: isActive
                                      ? 'var(--color-primary)'
                                      : 'var(--color-text)',
                                  }}
                                >
                                  {lesson.title}
                                </p>
                                <p
                                  className='text-[11px]'
                                  style={{
                                    color: 'var(--color-primary-muted)',
                                  }}
                                >
                                  {lesson.duration}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
