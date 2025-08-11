'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Tag as TagIcon, Hash, Palette, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Layout } from '@/components/ui/Layout'
import { Modal } from '@/components/ui/Modal'
import TagBadge from '@/components/features/TagBadge'

interface Tag {
  id: string
  name: string
  color: string
  level: number
  parentId?: string
  parent?: Tag | null
  children?: Tag[]
  _count?: {
    notes: number
    children: number
  }
}

interface TagStats {
  total: number
  mostUsed: {
    id: string
    name: string
    color: string
    usageCount: number
  }[]
}

const DEFAULT_COLORS = [
  '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
  '#be123c', '#0891b2', '#65a30d', '#c2410c', '#9333ea'
]

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [tagStats, setTagStats] = useState<TagStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    color: DEFAULT_COLORS[0],
    parentId: ''
  })

  // 获取标签列表
  const fetchTags = async () => {
    try {
      setLoading(true)
      const [tagsResponse, statsResponse] = await Promise.all([
        fetch('/api/tags?view=tree'),
        fetch('/api/tags?stats=true')
      ])

      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        setTags(tagsData.data || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setTagStats(statsData.data)
      }
    } catch (error) {
      console.error('获取标签失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 搜索标签
  const searchTags = async (term: string) => {
    if (!term.trim()) {
      fetchTags()
      return
    }

    try {
      const response = await fetch(`/api/tags?search=${encodeURIComponent(term)}`)
      if (response.ok) {
        const data = await response.json()
        setTags(data.data || [])
      }
    } catch (error) {
      console.error('搜索标签失败:', error)
    }
  }

  // 创建标签
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
          parentId: formData.parentId || undefined
        })
      })

      if (response.ok) {
        setIsCreateModalOpen(false)
        setFormData({ name: '', color: DEFAULT_COLORS[0], parentId: '' })
        fetchTags()
      } else {
        const error = await response.json()
        alert(error.message || '创建标签失败')
      }
    } catch (error) {
      console.error('创建标签失败:', error)
      alert('创建标签失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 更新标签
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTag || !formData.name.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
          parentId: formData.parentId || null
        })
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedTag(null)
        setFormData({ name: '', color: DEFAULT_COLORS[0], parentId: '' })
        fetchTags()
      } else {
        const error = await response.json()
        alert(error.message || '更新标签失败')
      }
    } catch (error) {
      console.error('更新标签失败:', error)
      alert('更新标签失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 删除标签
  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm(`确定要删除标签"${tag.name}"吗？`)) return

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTags()
      } else {
        const error = await response.json()
        alert(error.message || '删除标签失败')
      }
    } catch (error) {
      console.error('删除标签失败:', error)
      alert('删除标签失败')
    }
  }

  // 打开编辑模态框
  const openEditModal = (tag: Tag) => {
    setSelectedTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color,
      parentId: tag.parentId || ''
    })
    setIsEditModalOpen(true)
  }

  // 切换展开状态
  const toggleExpanded = (tagId: string) => {
    const newExpanded = new Set(expandedTags)
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId)
    } else {
      newExpanded.add(tagId)
    }
    setExpandedTags(newExpanded)
  }

  // 渲染标签树
  const renderTagTree = (tags: Tag[], level = 0) => {
    return tags.map((tag) => (
      <div key={tag.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          {/* 展开/折叠按钮 */}
          {tag.children && tag.children.length > 0 ? (
            <button
              onClick={() => toggleExpanded(tag.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {expandedTags.has(tag.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* 标签信息 */}
          <div className="flex-1 flex items-center gap-3">
            <TagBadge name={tag.name} color={tag.color} />
            <span className="text-sm text-gray-500">
              {tag._count?.notes || 0} 个笔记
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(tag)}
              className="p-1.5"
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTag(tag)}
              className="p-1.5 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* 子标签 */}
        {tag.children && tag.children.length > 0 && expandedTags.has(tag.id) && (
          <div>
            {renderTagTree(tag.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  // 获取所有标签的扁平列表（用于父标签选择）
  const getFlatTagList = (tags: Tag[]): Tag[] => {
    const result: Tag[] = []
    const traverse = (tagList: Tag[]) => {
      for (const tag of tagList) {
        result.push(tag)
        if (tag.children) {
          traverse(tag.children)
        }
      }
    }
    traverse(tags)
    return result
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchTags(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const flatTags = getFlatTagList(tags)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">标签管理</h1>
            <p className="text-gray-600">组织和管理你的笔记标签</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            新建标签
          </Button>
        </div>

        {/* 统计信息 */}
        {tagStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TagIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">标签总数</p>
                  <p className="text-2xl font-semibold">{tagStats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">最常用标签</h3>
              <div className="flex flex-wrap gap-2">
                {tagStats.mostUsed.slice(0, 5).map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <TagBadge name={tag.name} color={tag.color} />
                    <span className="text-xs text-gray-500">{tag.usageCount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="搜索标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 标签列表 */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {searchTerm ? `搜索结果 (${tags.length})` : '标签列表'}
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                加载中...
              </div>
            ) : tags.length > 0 ? (
              renderTagTree(tags)
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? '未找到匹配的标签' : '暂无标签'}
              </div>
            )}
          </div>
        </Card>

        {/* 创建标签模态框 */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="创建新标签"
        >
          <form onSubmit={handleCreateTag} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签名称
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入标签名称"
                required
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签颜色
              </label>
              <div className="flex gap-2 mb-2">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-400 shadow-md scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                父标签（可选）
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择父标签（可选）</option>
                {flatTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {'  '.repeat(tag.level)}{tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? '创建中...' : '创建标签'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* 编辑标签模态框 */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`编辑标签: ${selectedTag?.name}`}
        >
          <form onSubmit={handleUpdateTag} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签名称
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入标签名称"
                required
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签颜色
              </label>
              <div className="flex gap-2 mb-2">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-400 shadow-md scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                父标签（可选）
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择父标签（可选）</option>
                {flatTags.filter(tag => tag.id !== selectedTag?.id).map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {'  '.repeat(tag.level)}{tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? '更新中...' : '更新标签'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}