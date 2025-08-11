'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Plus, X } from 'lucide-react'
import TagBadge from './TagBadge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Tag {
  id: string
  name: string
  color: string
}

interface TagInputProps {
  selectedTags: Tag[]
  availableTags: Tag[]
  onTagSelect: (tag: Tag) => void
  onTagRemove: (tagId: string) => void
  onTagCreate: (name: string, color?: string) => void
  placeholder?: string
  maxTags?: number
  allowCreate?: boolean
  loading?: boolean
  className?: string
}

export default function TagInput({
  selectedTags,
  availableTags,
  onTagSelect,
  onTagRemove,
  onTagCreate,
  placeholder = '搜索或创建标签...',
  maxTags,
  allowCreate = true,
  loading = false,
  className = ''
}: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 过滤可用标签
  const filteredTags = availableTags.filter(tag => 
    !selectedTags.some(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 检查是否可以创建新标签
  const canCreateTag = allowCreate && 
    searchTerm.trim() && 
    !filteredTags.some(tag => tag.name.toLowerCase() === searchTerm.toLowerCase()) &&
    !selectedTags.some(tag => tag.name.toLowerCase() === searchTerm.toLowerCase())

  const displayOptions = [...filteredTags]
  if (canCreateTag) {
    displayOptions.push({
      id: 'create-new',
      name: searchTerm.trim(),
      color: '#2563eb'
    })
  }

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true)
      setHighlightedIndex(0)
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < displayOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : displayOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && displayOptions[highlightedIndex]) {
          handleSelectOption(displayOptions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // 处理选项选择
  const handleSelectOption = (option: Tag) => {
    if (option.id === 'create-new') {
      onTagCreate(option.name)
    } else {
      onTagSelect(option)
    }
    setSearchTerm('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 重置高亮索引当选项变化时
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  const isMaxTagsReached = maxTags && selectedTags.length >= maxTags

  return (
    <div className={`relative ${className}`}>
      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              removable
              onRemove={() => onTagRemove(tag.id)}
            />
          ))}
        </div>
      )}

      {/* 输入框 */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={isMaxTagsReached ? '已达到标签数量限制' : placeholder}
            disabled={isMaxTagsReached || loading}
            className="pl-10"
          />
        </div>

        {/* 下拉选项 */}
        {isOpen && !isMaxTagsReached && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                搜索中...
              </div>
            ) : displayOptions.length > 0 ? (
              displayOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`
                    px-3 py-2 cursor-pointer flex items-center justify-between
                    ${index === highlightedIndex 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    {option.id === 'create-new' ? (
                      <Plus size={16} className="text-green-500" />
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>
                      {option.id === 'create-new' ? `创建 "${option.name}"` : option.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                {searchTerm ? '未找到匹配的标签' : '暂无可用标签'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 标签数量提示 */}
      {maxTags && (
        <div className="mt-1 text-xs text-gray-500">
          已选择 {selectedTags.length}/{maxTags} 个标签
        </div>
      )}
    </div>
  )
}