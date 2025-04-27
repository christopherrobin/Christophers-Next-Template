import React from 'react'

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-16 h-16 border-8 border-t-transparent border-green-700 rounded-full animate-spin" />
    </div>
  )
}

export default Spinner
