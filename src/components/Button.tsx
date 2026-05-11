import Link from 'next/link'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  loading?: boolean
  className?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  ghost?: boolean
  target?: string
  rel?: string
}

const ButtonSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-6 h-6 border-4 border-t-transparent border-current rounded-full animate-spin" />
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
      ? `rounded border font-extrabold border-accent text-accent hover:border-accent-hover hover:text-fg transition cursor-pointer px-6 py-4 bg-transparent ${className} ${
          disabled || loading ? 'opacity-50 pointer-events-none' : ''
        }`
      : `rounded bg-accent text-on-accent font-extrabold hover:bg-accent-hover transition cursor-pointer px-6 py-4 ${className} ${
          disabled || loading ? 'opacity-50 pointer-events-none' : ''
        }`

    if (href) {
      return (
        <Link
          href={href}
          className={`${buttonClasses}`}
          target={props.target}
          rel={props.rel}
        >
          <span className="flex items-center justify-center gap-2">
            {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
            <span>{children}</span>
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
          </span>
        </Link>
      )
    }

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
