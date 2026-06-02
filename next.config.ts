import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin', 'nodemailer', 'razorpay'],

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    config.plugins?.push(
      new (require('webpack').NormalModuleReplacementPlugin)(
        /^node:/,
        (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, '')
        },
      ),
    )

    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          crypto: false,
          fs: false,
          path: false,
          os: false,
          stream: false,
          net: false,
          tls: false,
        },
      }
    }

    return config
  },
}

export default nextConfig
