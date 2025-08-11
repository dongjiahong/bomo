/**
 * 笔记数据操作函数
 * 提供笔记的 CRUD 操作和相关业务逻辑
 */

import { prisma, type Note, type NoteType, type NoteStatus } from './db'

// 创建笔记的数据类型
export interface CreateNoteData {
  title: string
  content: string
  type?: NoteType
  status?: NoteStatus
  isFavorite?: boolean
  isPinned?: boolean
  tagIds?: string[]
}

// 更新笔记的数据类型
export interface UpdateNoteData {
  title?: string
  content?: string
  type?: NoteType
  status?: NoteStatus
  isFavorite?: boolean
  isPinned?: boolean
  tagIds?: string[]
}

// 排序选项
export type SortOption = 'updatedAt' | 'createdAt' | 'title' | 'type'
export type SortOrder = 'asc' | 'desc'

// 笔记查询选项
export interface NoteQueryOptions {
  page?: number
  limit?: number
  type?: NoteType
  status?: NoteStatus
  isFavorite?: boolean
  isPinned?: boolean
  tagIds?: string[]
  searchTerm?: string
  sortBy?: SortOption
  sortOrder?: SortOrder
}

// 笔记详情（包含标签信息）
export interface NoteWithTags extends Note {
  tags: Array<{
    id: string
    noteId: string
    tagId: string
    tag: {
      id: string
      name: string
      color: string
    }
  }>
}

/**
 * 创建新笔记
 */
export async function createNote(data: CreateNoteData): Promise<NoteWithTags> {
  const { tagIds, ...noteData } = data

  const note = await prisma.note.create({
    data: {
      ...noteData,
      tags: tagIds ? {
        create: tagIds.map(tagId => ({ tagId }))
      } : undefined
    },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  return note
}

/**
 * 根据 ID 获取笔记详情
 */
export async function getNoteById(id: string): Promise<NoteWithTags | null> {
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  return note
}

/**
 * 获取笔记列表（支持分页、筛选、搜索、排序）
 */
export async function getNotes(options: NoteQueryOptions = {}) {
  const {
    page = 1,
    limit = 20,
    type,
    status,
    isFavorite,
    isPinned,
    tagIds,
    searchTerm,
    sortBy = 'updatedAt',
    sortOrder = 'desc'
  } = options

  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {}
  
  if (type) where.type = type
  if (status) where.status = status
  if (isFavorite !== undefined) where.isFavorite = isFavorite
  if (isPinned !== undefined) where.isPinned = isPinned
  
  // 标签筛选
  if (tagIds && tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: {
          in: tagIds
        }
      }
    }
  }

  // 搜索条件
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm } },
      { content: { contains: searchTerm } }
    ]
  }

  // 构建排序条件
  let orderBy: any
  
  // 置顶笔记优先显示
  if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
    orderBy = [
      { isPinned: 'desc' }, // 置顶笔记先显示
      { [sortBy]: sortOrder }
    ]
  } else {
    orderBy = [
      { isPinned: 'desc' },
      { [sortBy]: sortOrder },
      { updatedAt: 'desc' } // 次要排序
    ]
  }

  // 获取数据和总数
  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.note.count({ where })
  ])

  return {
    notes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 更新笔记
 */
export async function updateNote(id: string, data: UpdateNoteData): Promise<NoteWithTags | null> {
  const { tagIds, ...updateData } = data

  // 如果需要更新标签
  if (tagIds !== undefined) {
    // 先删除现有标签关联
    await prisma.tagRelation.deleteMany({
      where: { noteId: id }
    })
  }

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...updateData,
      tags: tagIds ? {
        create: tagIds.map(tagId => ({ tagId }))
      } : undefined
    },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  return note
}

/**
 * 删除笔记
 */
export async function deleteNote(id: string): Promise<boolean> {
  try {
    await prisma.note.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('删除笔记失败:', error)
    return false
  }
}

/**
 * 归档笔记
 */
export async function archiveNote(id: string): Promise<NoteWithTags | null> {
  return updateNote(id, { status: 'ARCHIVED' })
}

/**
 * 恢复笔记
 */
export async function restoreNote(id: string): Promise<NoteWithTags | null> {
  return updateNote(id, { status: 'PUBLISHED' })
}

/**
 * 获取笔记统计信息
 */
export async function getNoteStats() {
  const [total, byType, byStatus] = await Promise.all([
    prisma.note.count(),
    prisma.note.groupBy({
      by: ['type'],
      _count: true
    }),
    prisma.note.groupBy({
      by: ['status'],
      _count: true
    })
  ])

  return {
    total,
    byType: byType.reduce((acc, item) => {
      acc[item.type] = item._count
      return acc
    }, {} as Record<string, number>),
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, {} as Record<string, number>)
  }
}

/**
 * 收藏/取消收藏笔记
 */
export async function toggleFavoriteNote(id: string): Promise<NoteWithTags | null> {
  // 先获取当前状态
  const currentNote = await prisma.note.findUnique({
    where: { id },
    select: { isFavorite: true }
  })
  
  if (!currentNote) return null

  return updateNote(id, { isFavorite: !currentNote.isFavorite })
}

/**
 * 置顶/取消置顶笔记
 */
export async function togglePinNote(id: string): Promise<NoteWithTags | null> {
  // 先获取当前状态
  const currentNote = await prisma.note.findUnique({
    where: { id },
    select: { isPinned: true }
  })
  
  if (!currentNote) return null

  return updateNote(id, { isPinned: !currentNote.isPinned })
}

/**
 * 批量归档笔记
 */
export async function batchArchiveNotes(ids: string[]): Promise<number> {
  const result = await prisma.note.updateMany({
    where: {
      id: {
        in: ids
      }
    },
    data: {
      status: 'ARCHIVED'
    }
  })

  return result.count
}

/**
 * 批量删除笔记
 */
export async function batchDeleteNotes(ids: string[]): Promise<number> {
  const result = await prisma.note.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })

  return result.count
}

/**
 * 获取最近更新的笔记
 */
export async function getRecentNotes(limit: number = 5): Promise<NoteWithTags[]> {
  return prisma.note.findMany({
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: limit
  })
}

/**
 * 获取收藏的笔记
 */
export async function getFavoriteNotes(limit?: number): Promise<NoteWithTags[]> {
  return prisma.note.findMany({
    where: {
      isFavorite: true
    },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: [
      { isPinned: 'desc' },
      { updatedAt: 'desc' }
    ],
    take: limit
  })
}

/**
 * 获取置顶的笔记
 */
export async function getPinnedNotes(): Promise<NoteWithTags[]> {
  return prisma.note.findMany({
    where: {
      isPinned: true
    },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
}