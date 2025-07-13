import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // ✅ Use object, not boolean
  },
  serverExternalPackages: ['mongoose'], // ✅ NEW KEY (moved from experimental)
  images: {
    domains: ['m.media-amazon.com'],
  },
}

export default nextConfig
