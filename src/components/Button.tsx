// src/components/Button.tsx
import Link from 'next/link'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  loading?: boolean
  className?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  ghost?: boolean
}

const ButtonSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
    </div>
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      children,
      href,
      loading,
      disabled,
      startIcon,
      endIcon,
      ghost = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = ghost
      ? `rounded border bg-stone-200 border-green-700 text-green-700 hover:bg-[#e3ded3] transition cursor-pointer px-6 py-4 bg-transparent ${className} ${
          disabled || loading ? 'opacity-50 pointer-events-none' : ''
        }`
      : `rounded bg-green-700 text-white font-bold hover:bg-green-900 transition cursor-pointer px-6 py-4 ${className} ${
          disabled || loading ? 'opacity-50 pointer-events-none' : ''
        }`

    // If href is provided, render a Link component
    if (href) {
      return (
        <Link href={href} className={`${buttonClasses}`}>
          <span className="flex items-center justify-center gap-2">
            {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
            <span>{children}</span>
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
          </span>
        </Link>
      )
    }

    // Otherwise, render a button
    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ButtonSpinner />
        ) : (
          <span className="flex items-center justify-center gap-2">
            {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
            <span>{children}</span>
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
