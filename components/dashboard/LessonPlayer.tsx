'use client'

import { useState } from 'react'
import { PlayIcon, CheckIcon, ClockIcon, LockIcon } from '@/components/ui/Icons'

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

// Demo lesson for when no URL is provided
function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className='w-full aspect-video bg-gradient-to-br from-[#2D1B5E] to-[#4A2D8A] rounded-2xl flex flex-col items-center justify-center text-white'>
      <div className='w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4'>
        <PlayIcon size={28} className='text-white ml-1' />
      </div>
      <p className='font-serif text-[18px] font-bold text-center px-6'>
        {title}
      </p>
      <p className='text-purple-300 text-[13px] mt-2'>Click to play lesson</p>
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
    <div className='flex flex-col lg:flex-row gap-6 w-full'>
      {/* ── Video / content area ── */}
      <div className='flex-1 min-w-0'>
        {activeLesson ? (
          <div className='space-y-4'>
            {/* Player */}
            {activeLesson.videoUrl ? (
              <div className='w-full aspect-video rounded-2xl overflow-hidden bg-black'>
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
            <div className='bg-white border border-purple-100 rounded-2xl p-5'>
              <div className='flex items-start justify-between gap-4 flex-wrap'>
                <div>
                  <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E]'>
                    {activeLesson.title}
                  </h2>
                  <div className='flex items-center gap-3 mt-1 text-[13px] text-[#8470A8]'>
                    <div className='flex items-center gap-1'>
                      <ClockIcon size={13} /> {activeLesson.duration}
                    </div>
                    <div className='flex items-center gap-1'>
                      <TypeIcon type={activeLesson.type} /> {activeLesson.type}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => markComplete(activeLesson.id)}
                  disabled={completed.includes(activeLesson.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    completed.includes(activeLesson.id)
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-[#7C5CBF] text-white hover:bg-[#6A4DAD]'
                  }`}
                >
                  <CheckIcon size={14} />
                  {completed.includes(activeLesson.id)
                    ? 'Completed'
                    : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className='bg-white border border-purple-100 rounded-2xl p-5'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-[13px] font-semibold text-[#4A3570]'>
                  Course Progress
                </p>
                <p className='text-[13px] font-bold text-[#7C5CBF]'>
                  {completedCount}/{totalLessons} lessons · {progress}%
                </p>
              </div>
              <div className='h-2 bg-purple-100 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-[#7C5CBF] rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white border border-purple-100 rounded-2xl p-12 text-center'>
            <div className='text-[48px] mb-4'>🌸</div>
            <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-2'>
              Select a lesson to begin
            </h3>
            <p className='text-[14px] text-[#8470A8]'>
              Choose a lesson from the curriculum on the right.
            </p>
          </div>
        )}
      </div>

      {/* ── Curriculum sidebar ── */}
      <div className='lg:w-[320px] shrink-0'>
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden sticky top-24'>
          <div className='px-5 py-4 border-b border-purple-100 bg-[#F9F5FF]'>
            <h3 className='font-serif text-[15px] font-bold text-[#2D1B5E]'>
              Course Curriculum
            </h3>
            <p className='text-[12px] text-[#8470A8] mt-0.5'>
              {completedCount}/{totalLessons} completed
            </p>
          </div>

          <div className='overflow-y-auto max-h-[520px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {modules.map((mod) => {
              const isOpen = openModules.includes(mod.id)
              const modCompleted = mod.lessons.filter((l) =>
                completed.includes(l.id),
              ).length

              return (
                <div
                  key={mod.id}
                  className='border-b border-purple-50 last:border-0'
                >
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className='w-full flex items-center justify-between px-5 py-3.5 bg-transparent border-none cursor-pointer hover:bg-[#F9F5FF] transition-colors text-left'
                  >
                    <div>
                      <p className='text-[13px] font-semibold text-[#2D1B5E]'>
                        {mod.title}
                      </p>
                      <p className='text-[11px] text-[#8470A8] mt-0.5'>
                        {modCompleted}/{mod.lessons.length} done
                      </p>
                    </div>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#A67DD4'
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
                    <div className='divide-y divide-purple-50'>
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
                            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors border-none cursor-pointer ${
                              isActive
                                ? 'bg-[#F3EEFF]'
                                : lesson.isLocked
                                  ? 'cursor-not-allowed opacity-50 bg-transparent'
                                  : 'hover:bg-[#FAF8FF] bg-transparent'
                            }`}
                          >
                            {/* Status icon */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-green-100 text-green-600'
                                  : isActive
                                    ? 'bg-[#7C5CBF] text-white'
                                    : lesson.isLocked
                                      ? 'bg-purple-100 text-[#B0A0CC]'
                                      : 'bg-purple-100 text-[#A67DD4]'
                              }`}
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
                                className={`text-[12.5px] font-medium truncate ${isActive ? 'text-[#7C5CBF]' : 'text-[#2D1B5E]'}`}
                              >
                                {lesson.title}
                              </p>
                              <p className='text-[11px] text-[#8470A8]'>
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
  )
}
