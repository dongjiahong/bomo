'use client'

import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import TagBadge from './TagBadge'
import { NoteType, NoteStatus } from '@prisma/client'

interface FilterOptions {
  type?: NoteType
  status?: NoteStatus
  isFavorite?: boolean
  isPinned?: boolean
  tagIds?: string[]
}

interface Tag {
  id: string
  name: string
  color: string
}

interface NoteFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  availableTags?: Tag[]
}

const noteTypeOptions = [
  { value: 'GENERAL' as NoteType, label: '通用笔记', icon: '📝' },
  { value: 'READING' as NoteType, label: '读书笔记', icon: '📚' },
  { value: 'DIARY' as NoteType, label: '日记', icon: '📖' },
  { value: 'INSIGHT' as NoteType, label: '感悟', icon: '💡' },
  { value: 'TODO' as NoteType, label: '任务', icon: '✅' },
  { value: 'OBJECTIVE' as NoteType, label: '目标', icon: '🎯' }
]

const noteStatusOptions = [
  { value: 'DRAFT' as NoteStatus, label: '草稿', icon: '✏️' },
  { value: 'PUBLISHED' as NoteStatus, label: '已发布', icon: '📄' },
  { value: 'ARCHIVED' as NoteStatus, label: '已归档', icon: '🗄️' }
]

export function NoteFilters({ filters, onFiltersChange, onReset, availableTags = [] }: NoteFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters }
    if (newFilters[key] === value) {
      // 如果点击的是当前已选中的筛选项，则取消选择
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    onFiltersChange(newFilters)
  }

  const handleToggleSpecial = (key: 'isFavorite' | 'isPinned') => {
    const newFilters = { ...filters }
    newFilters[key] = filters[key] ? undefined : true
    onFiltersChange(newFilters)
  }

  const handleTagToggle = (tagId: string) => {
    const newFilters = { ...filters }
    const currentTagIds = newFilters.tagIds || []
    
    if (currentTagIds.includes(tagId)) {
      // 移除标签
      newFilters.tagIds = currentTagIds.filter(id => id !== tagId)
      if (newFilters.tagIds.length === 0) {
        delete newFilters.tagIds
      }
    } else {
      // 添加标签
      newFilters.tagIds = [...currentTagIds, tagId]
    }
    
    onFiltersChange(newFilters)
  }

  return (
    <Card className="mb-6">
      <Card.Content className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-700">筛选条件</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {Object.values(filters).filter(v => v !== undefined).length} 个筛选
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                清除筛选
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? '收起' : '展开'}
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
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* 特殊筛选 */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">特殊筛选</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.isFavorite ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSpecial('isFavorite')}
                  className="text-sm"
                >
                  ⭐ 收藏的
                </Button>
                <Button
                  variant={filters.isPinned ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSpecial('isPinned')}
                  className="text-sm"
                >
                  📌 置顶的
                </Button>
              </div>
            </div>

            {/* 笔记类型 */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">笔记类型</h4>
              <div className="flex flex-wrap gap-2">
                {noteTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.type === option.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('type', option.value)}
                    className="text-sm"
                  >
                    <span className="mr-1">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 笔记状态 */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">笔记状态</h4>
              <div className="flex flex-wrap gap-2">
                {noteStatusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.status === option.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('status', option.value)}
                    className="text-sm"
                  >
                    <span className="mr-1">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 标签筛选 */}
            {availableTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">按标签筛选</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`transition-all duration-200 ${
                        filters.tagIds?.includes(tag.id)
                          ? 'opacity-100 scale-100 ring-2 ring-offset-1'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        ringColor: filters.tagIds?.includes(tag.id) ? tag.color : 'transparent'
                      }}
                    >
                      <TagBadge
                        name={tag.name}
                        color={tag.color}
                        variant={filters.tagIds?.includes(tag.id) ? 'solid' : 'outline'}
                        size="sm"
                      />
                    </button>
                  ))}
                </div>
                {filters.tagIds && filters.tagIds.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    已选择 {filters.tagIds.length} 个标签
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}