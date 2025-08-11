'use client'

import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { SortOption, SortOrder } from '@/lib/notes'

interface NoteSorterProps {
  sortBy: SortOption
  sortOrder: SortOrder
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void
}

const sortOptions = [
  {
    value: 'updatedAt' as SortOption,
    label: '更新时间',
    icon: '🕒',
    description: '按最后修改时间排序'
  },
  {
    value: 'createdAt' as SortOption,
    label: '创建时间',
    icon: '📅',
    description: '按创建时间排序'
  },
  {
    value: 'title' as SortOption,
    label: '标题',
    icon: '🔤',
    description: '按标题字母顺序排序'
  },
  {
    value: 'type' as SortOption,
    label: '类型',
    icon: '🏷️',
    description: '按笔记类型排序'
  }
]

export function NoteSorter({ sortBy, sortOrder, onSortChange }: NoteSorterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentOption = sortOptions.find(option => option.value === sortBy)

  const handleSortByChange = (newSortBy: SortOption) => {
    onSortChange(newSortBy, sortOrder)
  }

  const handleOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'desc' ? 'asc' : 'desc')
  }

  return (
    <Card className="mb-6">
      <Card.Content className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">排序</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">{currentOption?.icon}</span>
              <span>{currentOption?.label}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOrderToggle}
                className="p-1 h-auto text-gray-500 hover:text-gray-700"
                title={sortOrder === 'desc' ? '降序 (点击改为升序)' : '升序 (点击改为降序)'}
              >
                {sortOrder === 'desc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? '收起' : '更多排序'}
            <svg 
              className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortByChange(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    sortBy === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                    {sortBy === option.value && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}