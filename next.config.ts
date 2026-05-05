// next.config.ts
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// Baseline CSP for a Next 16 + Tailwind 4 + NextAuth starter. Enforcing as of
// Phase 14.2 after a soak in Report-Only with zero violations. Forkers adding
// third-party scripts (analytics, embeds, etc.) may need to extend script-src
// or adopt a nonce-based approach.
//
// 'unsafe-inline' on style-src is the documented Tailwind 4 baseline (and
// required for Emotion/MUI in the sibling repo).
//
// 'unsafe-eval' on script-src is needed only for Next 16 dev mode (HMR /
// React DevTools) — dropped in production. frame-ancestors 'none'
// complements X-Frame-Options.
const scriptSrc = isProd
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'"

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ')

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
          key: 'Content-Security-Policy',
          value: csp
        }
      ]
    }
  ]
}

export default nextConfig
