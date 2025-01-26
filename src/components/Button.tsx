'use client'

import React from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  className?: string
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition ${className}`}
    >
      {label}
    </button>
  )
}

export default Button
