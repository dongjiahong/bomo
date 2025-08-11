'use client'

import React from 'react'
import { X } from 'lucide-react'

interface TagBadgeProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  removable?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export default function TagBadge({
  name,
  color = '#2563eb',
  size = 'md',
  variant = 'solid',
  removable = false,
  onClick,
  onRemove,
  className = ''
}: TagBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const baseClasses = `
    inline-flex items-center rounded-full font-medium
    transition-all duration-200 cursor-pointer
    ${sizeClasses[size]}
    ${className}
  `

  const variantClasses = variant === 'solid'
    ? `text-white shadow-sm hover:shadow-md`
    : `bg-transparent border-2 hover:bg-opacity-10`

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <span
      className={`${baseClasses} ${variantClasses}`}
      style={{
        backgroundColor: variant === 'solid' ? color : 'transparent',
        borderColor: variant === 'outline' ? color : 'transparent',
        color: variant === 'outline' ? color : 'white'
      }}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <span className="truncate max-w-32">{name}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1.5 -mr-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label={`移除标签 ${name}`}
        >
          <X size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      )}
    </span>
  )
}