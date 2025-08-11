'use client'

import { NoteWithTags } from '@/lib/notes'
import { Card } from '@/components/ui'
import TagBadge from './TagBadge'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

interface NoteCardProps {
  note: NoteWithTags
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  onTogglePin?: (id: string) => void
  onArchive?: (id: string) => void
}

const noteTypeColors = {
  GENERAL: 'bg-blue-50 text-blue-700 border-blue-200',
  READING: 'bg-green-50 text-green-700 border-green-200',
  DIARY: 'bg-purple-50 text-purple-700 border-purple-200',
  INSIGHT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  TODO: 'bg-red-50 text-red-700 border-red-200',
  OBJECTIVE: 'bg-indigo-50 text-indigo-700 border-indigo-200'
}

const noteTypeLabels = {
  GENERAL: '通用',
  READING: '读书',
  DIARY: '日记',
  INSIGHT: '感悟',
  TODO: '任务',
  OBJECTIVE: '目标'
}

const noteStatusLabels = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档'
}

export function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onTogglePin, 
  onArchive 
}: NoteCardProps) {
  // 截取内容预览
  const getContentPreview = (content: string) => {
    const plainText = content.replace(/[#*`_~\[\]()]/g, '').replace(/\n+/g, ' ')
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 relative ${
      note.isPinned ? 'ring-2 ring-blue-200 shadow-md' : ''
    }`}>
      <Card.Content className="p-6">
        {/* 置顶标识 */}
        {note.isPinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${noteTypeColors[note.type]}`}>
              {noteTypeLabels[note.type]}
            </span>
            <span className="text-xs text-gray-500">
              {noteStatusLabels[note.status]}
            </span>
            {/* 收藏标识 */}
            {note.isFavorite && (
              <span className="text-yellow-500" title="已收藏">
                ⭐
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* 收藏按钮 */}
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(note.id)}
                className={`p-1 transition-colors ${
                  note.isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
                title={note.isFavorite ? '取消收藏' : '收藏'}
              >
                <svg className="w-4 h-4" fill={note.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}

            {/* 置顶按钮 */}
            {onTogglePin && (
              <button
                onClick={() => onTogglePin(note.id)}
                className={`p-1 transition-colors ${
                  note.isPinned 
                    ? 'text-blue-500 hover:text-blue-600' 
                    : 'text-gray-400 hover:text-blue-500'
                }`}
                title={note.isPinned ? '取消置顶' : '置顶'}
              >
                <svg className="w-4 h-4" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}

            {/* 归档按钮 */}
            {onArchive && note.status !== 'ARCHIVED' && (
              <button
                onClick={() => onArchive(note.id)}
                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                title="归档"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </button>
            )}

            {/* 编辑按钮 */}
            {onEdit && (
              <button
                onClick={() => onEdit(note.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="编辑"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* 删除按钮 */}
            {onDelete && (
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <Link href={`/notes/${note.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {note.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {getContentPreview(note.content)}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 3).map((tagRelation) => (
                  <TagBadge
                    key={tagRelation.tag.id}
                    name={tagRelation.tag.name}
                    color={tagRelation.tag.color}
                    size="sm"
                    variant="outline"
                  />
                ))}
                {note.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <time className="text-xs text-gray-500">
            {formatRelativeTime(note.updatedAt)}
          </time>
        </div>
      </Card.Content>
    </Card>
  )
}