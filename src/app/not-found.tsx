// src/app/not-found.tsx
import React from 'react'

import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-extrabold text-accent mb-4">404</h1>
      <p className="text-xl text-fg/60 mb-8 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button href="/">Go Home</Button>
    </div>
  )
}
