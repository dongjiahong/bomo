'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MarkdownEditor } from '@/components/features/MarkdownEditor'
import TagInput from '@/components/features/TagInput'
import TagBadge from '@/components/features/TagBadge'
import { Button, Input, Card } from '@/components/ui'
import { NoteType, NoteStatus } from '@prisma/client'
import { NoteWithTags } from '@/lib/notes'

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
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'ARCHIVED', label: '已归档' }
]

export default function EditNotePage() {
  const [note, setNote] = useState<NoteWithTags | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<NoteType>('GENERAL')
  const [status, setStatus] = useState<NoteStatus>('DRAFT')
  const [selectedTags, setSelectedTags] = useState<any[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string

  // 加载笔记数据和标签
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteResponse, tagsResponse] = await Promise.all([
          fetch(`/api/notes/${noteId}`),
          fetch('/api/tags')
        ])
        
        const noteResult = await noteResponse.json()
        const tagsResult = await tagsResponse.json()
        
        if (noteResult.success) {
          const noteData = noteResult.data
          setNote(noteData)
          setTitle(noteData.title)
          setContent(noteData.content)
          setType(noteData.type)
          setStatus(noteData.status)
          
          // 设置已选择的标签
          const noteTags = noteData.tags?.map((tagRel: any) => ({
            id: tagRel.tag.id,
            name: tagRel.tag.name,
            color: tagRel.tag.color
          })) || []
          setSelectedTags(noteTags)
        } else {
          console.error('获取笔记失败:', noteResult.message)
          if (noteResponse.status === 404) {
            router.push('/notes')
          }
        }
        
        if (tagsResult.success) {
          const formattedTags = tagsResult.data.map((tag: any) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color
          }))
          setAvailableTags(formattedTags)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        router.push('/notes')
      } finally {
        setLoading(false)
      }
    }

    if (noteId) {
      fetchData()
    }
  }, [noteId, router])

  // 监听内容变化
  useEffect(() => {
    if (note) {
      const originalTags = note.tags?.map((tagRel: any) => tagRel.tag.id).sort() || []
      const currentTags = selectedTags.map(tag => tag.id).sort()
      
      const hasContentChanged = 
        title !== note.title || 
        content !== note.content || 
        type !== note.type || 
        status !== note.status ||
        JSON.stringify(originalTags) !== JSON.stringify(currentTags)
      
      setHasChanges(hasContentChanged)
    }
  }, [note, title, content, type, status, selectedTags])

  // 自动保存功能
  const handleAutoSave = async (newContent: string) => {
    if (!note || (!title.trim() && !newContent.trim())) return

    try {
      await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title || '无标题',
          content: newContent,
          type,
          status: 'DRAFT', // 自动保存时总是保存为草稿
          tagIds: selectedTags.map(tag => tag.id)
        })
      })
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

    setSaving(true)
    
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          type,
          status,
          tagIds: selectedTags.map(tag => tag.id)
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const updatedNote = result.data
        setNote(updatedNote)
        setHasChanges(false)
        
        // 如果状态是已发布，跳转到详情页
        if (status === 'PUBLISHED') {
          router.push(`/notes/${noteId}`)
        }
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
    if (hasChanges) {
      if (confirm('有未保存的更改，确定要离开吗？')) {
        router.push(`/notes/${noteId}`)
      }
    } else {
      router.push(`/notes/${noteId}`)
    }
  }

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

  // 处理标签选择
  const handleTagSelect = (tag: any) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 处理标签移除
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId))
  }

  // 处理创建新标签
  const handleTagCreate = async (name: string, color = '#2563eb') => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, color })
      })
      
      if (response.ok) {
        const result = await response.json()
        const newTag = {
          id: result.data.id,
          name: result.data.name,
          color: result.data.color
        }
        
        // 添加到可用标签列表
        setAvailableTags([...availableTags, newTag])
        
        // 自动选择新创建的标签
        setSelectedTags([...selectedTags, newTag])
      } else {
        const error = await response.json()
        alert(error.message || '创建标签失败')
      }
    } catch (error) {
      console.error('创建标签失败:', error)
      alert('创建标签失败')
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑笔记</h1>
          <p className="text-gray-600">
            创建于 {new Date(note.createdAt).toLocaleDateString('zh-CN')}
            {hasChanges && <span className="text-amber-600 ml-2">• 有未保存的更改</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            删除
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="min-w-20"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                保存中
              </div>
            ) : (
              '保存更改'
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
                  autoSave={true}
                  autoSaveDelay={3000}
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

              {/* 标签设置 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                <TagInput
                  selectedTags={selectedTags}
                  availableTags={availableTags}
                  onTagSelect={handleTagSelect}
                  onTagRemove={handleTagRemove}
                  onTagCreate={handleTagCreate}
                  placeholder="添加标签..."
                  maxTags={10}
                  allowCreate={true}
                />
              </div>

              {/* 统计信息 */}
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>字符数：</span>
                    <span>{content.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>字数：</span>
                    <span>{content.replace(/\s+/g, '').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>最后更新：</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>

              {/* 快捷键提示 */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-blue-800">
                      <strong>功能提示：</strong><br />
                      • 自动保存已启用<br />
                      • Ctrl+S 手动保存<br />
                      • 支持 Markdown 语法
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