'use client'

import { useState, useEffect } from 'react'
import { NoteWithTags, SortOption, SortOrder } from '@/lib/notes'
import { NoteCard } from '@/components/features/NoteCard'
import { NoteFilters } from '@/components/features/NoteFilters'
import { NoteSorter } from '@/components/features/NoteSorter'
import { EmptyState } from '@/components/features/EmptyState'
import { Button, Input, Card } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NoteType, NoteStatus } from '@prisma/client'

interface NotesResponse {
  notes: NoteWithTags[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface FilterOptions {
  type?: NoteType
  status?: NoteStatus
  isFavorite?: boolean
  isPinned?: boolean
  tagIds?: string[]
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotes, setTotalNotes] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [availableTags, setAvailableTags] = useState<any[]>([])
  
  const router = useRouter()

  // 获取笔记列表
  const fetchNotes = async (page: number = 1, search: string = '', currentFilters = filters, currentSortBy = sortBy, currentSortOrder = sortOrder) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy: currentSortBy,
        sortOrder: currentSortOrder
      })
      
      if (search) {
        params.append('search', search)
      }
      
      // 添加筛选参数
      if (currentFilters.type) {
        params.append('type', currentFilters.type)
      }
      if (currentFilters.status) {
        params.append('status', currentFilters.status)
      }
      if (currentFilters.isFavorite !== undefined) {
        params.append('isFavorite', currentFilters.isFavorite.toString())
      }
      if (currentFilters.isPinned !== undefined) {
        params.append('isPinned', currentFilters.isPinned.toString())
      }
      if (currentFilters.tagIds && currentFilters.tagIds.length > 0) {
        params.append('tagIds', currentFilters.tagIds.join(','))
      }

      const response = await fetch(`/api/notes?${params}`)
      const result = await response.json()

      if (result.success) {
        setNotes(result.data.notes)
        setCurrentPage(result.data.pagination.page)
        setTotalPages(result.data.pagination.pages)
        setTotalNotes(result.data.pagination.total)
      } else {
        console.error('获取笔记失败:', result.message)
      }
    } catch (error) {
      console.error('获取笔记失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除笔记
  const handleDeleteNote = async (id: string) => {
    if (!confirm('确定要删除这篇笔记吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 重新获取笔记列表
        await fetchNotes(currentPage, searchTerm, filters, sortBy, sortOrder)
      } else {
        alert('删除失败: ' + result.message)
      }
    } catch (error) {
      console.error('删除笔记失败:', error)
      alert('删除失败')
    }
  }

  // 编辑笔记
  const handleEditNote = (id: string) => {
    router.push(`/notes/${id}/edit`)
  }

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNotes(1, searchTerm, filters, sortBy, sortOrder)
  }

  // 分页处理
  const handlePageChange = (page: number) => {
    fetchNotes(page, searchTerm, filters, sortBy, sortOrder)
  }

  // 筛选处理
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) // 重置到第一页
    fetchNotes(1, searchTerm, newFilters, sortBy, sortOrder)
  }

  // 清除筛选条件
  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm('')
    setCurrentPage(1)
    fetchNotes(1, '', {}, sortBy, sortOrder)
  }

  // 排序处理
  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
    fetchNotes(1, searchTerm, filters, newSortBy, newSortOrder)
  }

  // 收藏/取消收藏笔记
  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}/favorite`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // 重新获取当前页的数据
        fetchNotes(currentPage, searchTerm, filters, sortBy, sortOrder)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 置顶/取消置顶笔记
  const handleTogglePin = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}/pin`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchNotes(currentPage, searchTerm, filters, sortBy, sortOrder)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 归档笔记
  const handleArchive = async (id: string) => {
    if (!confirm('确定要归档这篇笔记吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/notes/${id}/archive`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchNotes(currentPage, searchTerm, filters, sortBy, sortOrder)
      }
    } catch (error) {
      console.error('归档失败:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      // 同时获取笔记和标签数据
      await Promise.all([
        fetchNotes(),
        fetchTags()
      ])
    }
    
    loadData()
  }, [])

  // 获取可用标签
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      const result = await response.json()
      
      if (result.success) {
        const formattedTags = result.data.map((tag: any) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color
        }))
        setAvailableTags(formattedTags)
      }
    } catch (error) {
      console.error('获取标签失败:', error)
    }
  }

  if (loading && notes.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的笔记</h1>
          <p className="text-gray-600">共 {totalNotes} 篇笔记</p>
        </div>
        <Link href="/notes/new">
          <Button size="lg" className="shadow-sm">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新建笔记
          </Button>
        </Link>
      </div>

      {/* 搜索栏 */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索笔记标题或内容..."
                className="w-full"
              />
            </div>
            <Button type="submit" variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜索
            </Button>
          </form>
        </Card.Content>
      </Card>

      {/* 筛选器 */}
      <NoteFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleClearFilters}
        availableTags={availableTags}
      />

      {/* 排序器 */}
      <NoteSorter 
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* 笔记列表 */}
      {notes.length === 0 ? (
        <EmptyState
          searchTerm={searchTerm}
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
                onArchive={handleArchive}
              />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}