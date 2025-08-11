'use client'

import { Button, Card } from '@/components/ui'
import Link from 'next/link'
import { NoteType, NoteStatus } from '@prisma/client'

interface EmptyStateProps {
  type?: 'general' | 'search' | 'filtered' | 'archived' | 'favorites' | 'pinned'
  searchTerm?: string
  filters?: {
    type?: NoteType
    status?: NoteStatus
    isFavorite?: boolean
    isPinned?: boolean
  }
  onClearFilters?: () => void
}

const emptyStates = {
  general: {
    icon: '📝',
    title: '还没有笔记',
    description: '创建您的第一篇笔记，开始您的知识之旅',
    action: {
      text: '创建第一篇笔记',
      href: '/notes/new'
    }
  },
  search: {
    icon: '🔍',
    title: '没有找到相关笔记',
    description: '尝试使用其他关键词搜索，或者检查拼写是否正确'
  },
  filtered: {
    icon: '🎯',
    title: '没有符合条件的笔记',
    description: '当前筛选条件下没有找到笔记，请尝试调整筛选条件'
  },
  archived: {
    icon: '🗄️',
    title: '还没有归档的笔记',
    description: '归档的笔记会出现在这里，让您的活跃笔记保持整洁'
  },
  favorites: {
    icon: '⭐',
    title: '还没有收藏的笔记',
    description: '点击笔记卡片上的星星图标来收藏重要的笔记'
  },
  pinned: {
    icon: '📌',
    title: '还没有置顶的笔记',
    description: '置顶的笔记会显示在列表顶部，方便快速访问'
  }
}

export function EmptyState({ type = 'general', searchTerm, filters, onClearFilters }: EmptyStateProps) {
  // 根据搜索和筛选条件确定显示类型
  let displayType = type
  if (searchTerm) {
    displayType = 'search'
  } else if (filters?.status === 'ARCHIVED') {
    displayType = 'archived'
  } else if (filters?.isFavorite) {
    displayType = 'favorites'
  } else if (filters?.isPinned) {
    displayType = 'pinned'
  } else if (Object.values(filters || {}).some(v => v !== undefined)) {
    displayType = 'filtered'
  }

  const state = emptyStates[displayType]

  // 构建筛选条件描述
  const getFilterDescription = () => {
    if (!filters) return ''
    
    const conditions: string[] = []
    
    if (filters.type) {
      const typeLabels = {
        GENERAL: '通用笔记',
        READING: '读书笔记', 
        DIARY: '日记',
        INSIGHT: '感悟',
        TODO: '任务',
        OBJECTIVE: '目标'
      }
      conditions.push(`类型：${typeLabels[filters.type]}`)
    }
    
    if (filters.status) {
      const statusLabels = {
        DRAFT: '草稿',
        PUBLISHED: '已发布',
        ARCHIVED: '已归档'
      }
      conditions.push(`状态：${statusLabels[filters.status]}`)
    }
    
    if (filters.isFavorite) conditions.push('已收藏')
    if (filters.isPinned) conditions.push('已置顶')
    
    return conditions.length > 0 ? `当前筛选：${conditions.join('、')}` : ''
  }

  return (
    <Card>
      <Card.Content className="py-16 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">{state.icon}</div>
          {displayType === 'search' && searchTerm && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg inline-block">
              <span className="text-sm text-gray-600">搜索词：</span>
              <span className="text-sm font-medium text-gray-900 ml-1">"{searchTerm}"</span>
            </div>
          )}
          {displayType === 'filtered' && filters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg inline-block">
              <span className="text-sm text-blue-700">{getFilterDescription()}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{state.title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{state.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {'action' in state && state.action && (
            <Link href={state.action.href}>
              <Button size="lg" className="shadow-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {state.action.text}
              </Button>
            </Link>
          )}
          
          {onClearFilters && (displayType === 'search' || displayType === 'filtered') && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={onClearFilters}
              className="shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              清除筛选条件
            </Button>
          )}
        </div>

        {/* 额外的建议 */}
        {displayType === 'search' && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">搜索建议</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• 尝试使用更简单或更通用的关键词</p>
              <p>• 检查拼写是否正确</p>
              <p>• 尝试搜索笔记的标签或类型</p>
            </div>
          </div>
        )}

        {displayType === 'filtered' && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">建议</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• 尝试调整或减少筛选条件</p>
              <p>• 检查是否有符合条件的笔记</p>
              <p>• 创建符合当前筛选条件的新笔记</p>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}