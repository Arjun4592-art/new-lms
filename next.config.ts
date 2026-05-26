import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
  },
}

export default nextConfig
