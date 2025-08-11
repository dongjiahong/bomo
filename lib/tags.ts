/**
 * 标签数据操作函数
 * 提供标签的 CRUD 操作和层级管理功能
 */

import { prisma, type Tag } from './db'

// 创建标签的数据类型
export interface CreateTagData {
  name: string
  color?: string
  parentId?: string
}

// 更新标签的数据类型
export interface UpdateTagData {
  name?: string
  color?: string
  parentId?: string
}

// 标签详情（包含层级信息）
export interface TagWithHierarchy extends Tag {
  parent?: Tag | null
  children?: TagWithHierarchy[]
  _count?: {
    notes: number
    children: number
  }
}

/**
 * 创建新标签
 */
export async function createTag(data: CreateTagData): Promise<TagWithHierarchy> {
  // 如果有父标签，计算层级
  let level = 0
  if (data.parentId) {
    const parent = await prisma.tag.findUnique({
      where: { id: data.parentId }
    })
    if (parent) {
      level = parent.level + 1
    }
  }

  const tag = await prisma.tag.create({
    data: {
      ...data,
      level
    },
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    }
  })

  return tag
}

/**
 * 根据 ID 获取标签详情
 */
export async function getTagById(id: string): Promise<TagWithHierarchy | null> {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          children: true,
          _count: {
            select: {
              notes: true,
              children: true
            }
          }
        }
      },
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    }
  })

  return tag
}

/**
 * 获取所有标签（层级结构）
 */
export async function getAllTags(): Promise<TagWithHierarchy[]> {
  const tags = await prisma.tag.findMany({
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    },
    orderBy: [
      { level: 'asc' },
      { name: 'asc' }
    ]
  })

  return tags
}

/**
 * 获取根级标签（没有父标签的标签）
 */
export async function getRootTags(): Promise<TagWithHierarchy[]> {
  const tags = await prisma.tag.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: true,
          _count: {
            select: {
              notes: true,
              children: true
            }
          }
        }
      },
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return tags
}

/**
 * 获取标签树（完整层级结构）
 */
export async function getTagTree(): Promise<TagWithHierarchy[]> {
  const buildTree = (tags: TagWithHierarchy[], parentId: string | null = null): TagWithHierarchy[] => {
    return tags
      .filter(tag => tag.parentId === parentId)
      .map(tag => ({
        ...tag,
        children: buildTree(tags, tag.id)
      }))
  }

  const allTags = await getAllTags()
  return buildTree(allTags)
}

/**
 * 更新标签
 */
export async function updateTag(id: string, data: UpdateTagData): Promise<TagWithHierarchy | null> {
  // 如果更改了父标签，需要重新计算层级
  let updateData: any = { ...data }
  
  if (data.parentId !== undefined) {
    if (data.parentId) {
      const parent = await prisma.tag.findUnique({
        where: { id: data.parentId }
      })
      if (parent) {
        updateData.level = parent.level + 1
      }
    } else {
      updateData.level = 0
    }
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: updateData,
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    }
  })

  // 如果层级发生变化，需要更新所有子标签的层级
  if (updateData.level !== undefined) {
    await updateChildrenLevel(id)
  }

  return tag
}

/**
 * 递归更新子标签的层级
 */
async function updateChildrenLevel(parentId: string): Promise<void> {
  const parent = await prisma.tag.findUnique({
    where: { id: parentId },
    include: { children: true }
  })

  if (!parent || !parent.children.length) return

  // 更新直接子标签
  await Promise.all(
    parent.children.map(async (child) => {
      await prisma.tag.update({
        where: { id: child.id },
        data: { level: parent.level + 1 }
      })
      
      // 递归更新子标签的子标签
      await updateChildrenLevel(child.id)
    })
  )
}

/**
 * 删除标签
 */
export async function deleteTag(id: string): Promise<boolean> {
  try {
    // 检查是否有子标签
    const childrenCount = await prisma.tag.count({
      where: { parentId: id }
    })

    if (childrenCount > 0) {
      throw new Error('无法删除有子标签的标签')
    }

    await prisma.tag.delete({
      where: { id }
    })
    
    return true
  } catch (error) {
    console.error('删除标签失败:', error)
    return false
  }
}

/**
 * 获取标签使用统计
 */
export async function getTagStats() {
  const [total, mostUsedTags] = await Promise.all([
    prisma.tag.count(),
    prisma.tag.findMany({
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      },
      orderBy: {
        notes: {
          _count: 'desc'
        }
      },
      take: 10
    })
  ])

  return {
    total,
    mostUsed: mostUsedTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      usageCount: tag._count.notes
    }))
  }
}

/**
 * 搜索标签
 */
export async function searchTags(searchTerm: string): Promise<TagWithHierarchy[]> {
  const tags = await prisma.tag.findMany({
    where: {
      name: {
        contains: searchTerm
      }
    },
    include: {
      parent: true,
      children: true,
      _count: {
        select: {
          notes: true,
          children: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return tags
}

/**
 * 获取标签的完整路径
 */
export async function getTagPath(id: string): Promise<string[]> {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: { parent: true }
  })

  if (!tag) return []

  const path = [tag.name]
  
  if (tag.parent) {
    const parentPath = await getTagPath(tag.parent.id)
    return [...parentPath, ...path]
  }

  return path
}

/**
 * 批量创建标签（用于初始化数据）
 */
export async function createTagsBatch(tags: CreateTagData[]): Promise<Tag[]> {
  const createdTags: Tag[] = []
  
  for (const tagData of tags) {
    const tag = await createTag(tagData)
    createdTags.push(tag)
  }
  
  return createdTags
}