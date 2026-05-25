import HeroSection from '@/components/home/HeroSection'
import TransformationSection from '@/components/home/TransformationSection'
import AboutPreview from '@/components/home/AboutPreview'
import CoursesPreview from '@/components/home/CoursesPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'

export const metadata = {
  title: 'Pain to Power Coaching | Transformational Life Coaching for Women',
  description:
    'A safe, supportive space for women to release emotional pain, set healthy boundaries, and create a life rooted in confidence, clarity, and self-worth.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TransformationSection />
      <AboutPreview />
      <CoursesPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
