import React, { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  hideLabel?: boolean
}

const VISUALLY_HIDDEN =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, hideLabel = false, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    return (
      <>
        {label && (
          <label
            htmlFor={inputId}
            className={hideLabel ? VISUALLY_HIDDEN : 'text-sm text-fg/70 mb-1'}
          >
            {label}
          </label>
        )}
        {/* Intentionally always-light: white field with dark text in both
            schemes. Deliberate UX choice — keep consistent across themes. */}
        <input
          ref={ref}
          id={inputId}
          className={`p-4 rounded shadow-xs bg-white text-gray-800 ${className}`.trim()}
          {...props}
        />
      </>
    )
  }
)
Input.displayName = 'Input'

export { Input }
