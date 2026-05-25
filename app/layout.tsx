import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pain to Power Coaching',
  description:
    'Transforming Emotional Pain into Confidence, Clarity & Inner Strength. A safe space for women to heal, grow and rise.',
  keywords: [
    'life coaching',
    'emotional healing',
    'women empowerment',
    'self-worth',
    'boundaries',
  ],
  openGraph: {
    title: 'Pain to Power Coaching',
    description:
      'Turn Your Pain Into Power. Heal, Grow, and Step Into the Strongest Version Of You.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
