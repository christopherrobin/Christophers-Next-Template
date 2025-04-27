import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`p-4 rounded shadow-xs bg-white text-gray-800 ${className}`.trim()}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
