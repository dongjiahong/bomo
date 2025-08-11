'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownEditor } from '@/components/features/MarkdownEditor'
import { Button, Input, Card } from '@/components/ui'
import { NoteType, NoteStatus } from '@prisma/client'

const noteTypeOptions = [
  { value: 'GENERAL', label: '通用笔记' },
  { value: 'READING', label: '读书笔记' },
  { value: 'DIARY', label: '日记' },
  { value: 'INSIGHT', label: '感悟' },
  { value: 'TODO', label: '任务' },
  { value: 'OBJECTIVE', label: '目标' }
]

const noteStatusOptions = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'PUBLISHED', label: '已发布' }
]

export default function NewNotePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<NoteType>('GENERAL')
  const [status, setStatus] = useState<NoteStatus>('DRAFT')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const router = useRouter()

  // 自动保存功能
  const handleAutoSave = async (content: string) => {
    if (!title.trim() || !content.trim()) return

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title || '无标题',
          content,
          type,
          status: 'DRAFT' // 自动保存时总是保存为草稿
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // 自动保存成功后，跳转到编辑页面
        router.replace(`/notes/${result.data.id}/edit`)
      }
    } catch (error) {
      console.error('自动保存失败:', error)
    }
  }

  // 手动保存
  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入笔记标题')
      return
    }

    if (!content.trim()) {
      alert('请输入笔记内容')
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          type,
          status
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // 保存成功，跳转到笔记详情页
        router.push(`/notes/${result.data.id}`)
      } else {
        alert('保存失败: ' + result.message)
      }
    } catch (error) {
      console.error('保存笔记失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // 取消编辑
  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (confirm('有未保存的内容，确定要离开吗？')) {
        router.push('/notes')
      }
    } else {
      router.push('/notes')
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新笔记</h1>
          <p className="text-gray-600">写下你的想法，记录你的灵感</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="min-w-20"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                保存中
              </div>
            ) : (
              '保存笔记'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主编辑区域 */}
        <div className="lg:col-span-3">
          <Card>
            <Card.Content className="p-6">
              {/* 标题输入 */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  标题 *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入笔记标题..."
                  className="text-lg font-semibold"
                />
              </div>

              {/* Markdown 编辑器 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容 *
                </label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  onSave={handleAutoSave}
                  placeholder="开始写作..."
                  height={500}
                  autoSave={false} // 新建时不启用自动保存，避免创建大量草稿
                  className="border rounded-lg overflow-hidden"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* 侧边栏设置 */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Content className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">笔记设置</h3>
              
              {/* 笔记类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  笔记类型
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NoteType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {noteTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 发布状态 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  发布状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NoteStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {noteStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 保存快捷键提示 */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-blue-800">
                      <strong>快捷键提示：</strong><br />
                      Ctrl+S 快速保存<br />
                      支持 Markdown 语法
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}