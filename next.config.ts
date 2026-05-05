// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Apply security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'Permissions-Policy',
          value:
            'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
        },
        {
          // Baseline CSP for a Next 16 + Tailwind 4 + NextAuth starter.
          // Enforcing as of Phase 14.2 after a soak in Report-Only with
          // zero violations. Forkers adding third-party scripts (analytics,
          // embeds, etc.) may need to extend script-src or adopt a
          // nonce-based approach.
          // 'unsafe-inline' on style-src is the documented Tailwind 4
          // baseline (and required for Emotion/MUI in the sibling repo).
          // 'unsafe-eval' on script-src covers Next 16 dev / React 19
          // hydration. frame-ancestors 'none' complements X-Frame-Options.
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; ')
        }
      ]
    }
  ]
}

export default nextConfig
