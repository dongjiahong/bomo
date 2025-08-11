'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import TagBadge from '@/components/features/TagBadge'
import { NoteWithTags } from '@/lib/notes'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

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

export default function NoteDetailPage() {
  const [note, setNote] = useState<NoteWithTags | null>(null)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string

  // 加载笔记数据
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`)
        const result = await response.json()
        
        if (result.success) {
          setNote(result.data)
        } else {
          console.error('获取笔记失败:', result.message)
          if (response.status === 404) {
            router.push('/notes')
          }
        }
      } catch (error) {
        console.error('获取笔记失败:', error)
        router.push('/notes')
      } finally {
        setLoading(false)
      }
    }

    if (noteId) {
      fetchNote()
    }
  }, [noteId, router])

  // 删除笔记
  const handleDelete = async () => {
    if (!confirm('确定要删除这篇笔记吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        router.push('/notes')
      } else {
        alert('删除失败: ' + result.message)
      }
    } catch (error) {
      console.error('删除笔记失败:', error)
      alert('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">笔记不存在</h1>
          <Button onClick={() => router.push('/notes')}>返回笔记列表</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${noteTypeColors[note.type]}`}>
              {noteTypeLabels[note.type]}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full border border-gray-200 text-gray-700 bg-gray-50">
              {noteStatusLabels[note.status]}
            </span>
            {note.status === 'DRAFT' && (
              <span className="text-sm text-amber-600">草稿状态</span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {note.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              创建于 {new Date(note.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              最后编辑于 {new Date(note.updatedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>

          {/* 标签 */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {note.tags.map((tagRelation) => (
                <TagBadge
                  key={tagRelation.tag.id}
                  name={tagRelation.tag.name}
                  color={tagRelation.tag.color}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 ml-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/notes')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回列表
          </Button>
          <Link href={`/notes/${noteId}/edit`}>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
            </svg>
            删除
          </Button>
        </div>
      </div>

      {/* 笔记内容 */}
      <Card>
        <Card.Content className="p-0">
          <div className="prose prose-lg max-w-none p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              className="markdown-content"
              components={{
                // 自定义组件样式
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 pb-3 border-b border-gray-200">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-400 pl-6 py-2 my-6 bg-blue-50 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children, ...props }) => {
                  return inline ? (
                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 leading-relaxed">
                    {children}
                  </li>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {children}
                  </td>
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </Card.Content>
      </Card>

      {/* 页脚信息 */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div>字符数: {note.content.length}</div>
          <div>字数: {note.content.replace(/\s+/g, '').length}</div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/notes">
            <Button variant="outline" size="sm">
              查看更多笔记
            </Button>
          </Link>
          <Link href="/notes/new">
            <Button size="sm">
              创建新笔记
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}