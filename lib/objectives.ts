/**
 * OKR（目标与关键结果）数据操作函数
 * 提供目标和关键结果的 CRUD 操作和进度管理
 */

import { prisma, type Objective, type KeyResult, type ObjectiveType, type ObjectiveStatus } from './db'

// 创建目标的数据类型
export interface CreateObjectiveData {
  title: string
  description?: string
  type?: ObjectiveType
  deadline?: Date
  keyResults?: CreateKeyResultData[]
}

// 创建关键结果的数据类型
export interface CreateKeyResultData {
  description: string
  targetValue: number
  currentValue?: number
  unit?: string
}

// 更新目标的数据类型
export interface UpdateObjectiveData {
  title?: string
  description?: string
  type?: ObjectiveType
  deadline?: Date
  status?: ObjectiveStatus
}

// 更新关键结果的数据类型
export interface UpdateKeyResultData {
  description?: string
  targetValue?: number
  currentValue?: number
  unit?: string
}

// 目标详情（包含关键结果）
export interface ObjectiveWithKeyResults extends Objective {
  keyResults: KeyResult[]
}

// 目标查询选项
export interface ObjectiveQueryOptions {
  type?: ObjectiveType
  status?: ObjectiveStatus
  page?: number
  limit?: number
}

/**
 * 创建新目标
 */
export async function createObjective(data: CreateObjectiveData): Promise<ObjectiveWithKeyResults> {
  const { keyResults, ...objectiveData } = data

  const objective = await prisma.objective.create({
    data: {
      ...objectiveData,
      keyResults: keyResults ? {
        create: keyResults
      } : undefined
    },
    include: {
      keyResults: true
    }
  })

  return objective
}

/**
 * 根据 ID 获取目标详情
 */
export async function getObjectiveById(id: string): Promise<ObjectiveWithKeyResults | null> {
  const objective = await prisma.objective.findUnique({
    where: { id },
    include: {
      keyResults: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  return objective
}

/**
 * 获取目标列表
 */
export async function getObjectives(options: ObjectiveQueryOptions = {}) {
  const {
    type,
    status,
    page = 1,
    limit = 20
  } = options

  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {}
  if (type) where.type = type
  if (status) where.status = status

  // 获取数据和总数
  const [objectives, total] = await Promise.all([
    prisma.objective.findMany({
      where,
      include: {
        keyResults: true
      },
      orderBy: [
        { status: 'asc' }, // 活跃的目标排前面
        { deadline: 'asc' }, // 按截止时间排序
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    }),
    prisma.objective.count({ where })
  ])

  // 计算每个目标的整体进度
  const objectivesWithProgress = objectives.map(objective => {
    const keyResultsCount = objective.keyResults.length
    if (keyResultsCount === 0) {
      return { ...objective, calculatedProgress: 0 }
    }

    const totalProgress = objective.keyResults.reduce((sum, kr) => {
      const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0
      return sum + Math.min(progress, 100) // 限制最大值为 100%
    }, 0)

    const averageProgress = totalProgress / keyResultsCount
    return { ...objective, calculatedProgress: Math.round(averageProgress) }
  })

  return {
    objectives: objectivesWithProgress,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * 更新目标
 */
export async function updateObjective(id: string, data: UpdateObjectiveData): Promise<ObjectiveWithKeyResults | null> {
  const objective = await prisma.objective.update({
    where: { id },
    data,
    include: {
      keyResults: true
    }
  })

  // 重新计算进度
  await updateObjectiveProgress(id)

  return objective
}

/**
 * 删除目标
 */
export async function deleteObjective(id: string): Promise<boolean> {
  try {
    await prisma.objective.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('删除目标失败:', error)
    return false
  }
}

/**
 * 创建关键结果
 */
export async function createKeyResult(objectiveId: string, data: CreateKeyResultData): Promise<KeyResult> {
  const keyResult = await prisma.keyResult.create({
    data: {
      ...data,
      objectiveId
    }
  })

  // 更新目标进度
  await updateObjectiveProgress(objectiveId)

  return keyResult
}

/**
 * 更新关键结果
 */
export async function updateKeyResult(id: string, data: UpdateKeyResultData): Promise<KeyResult | null> {
  const keyResult = await prisma.keyResult.update({
    where: { id },
    data
  })

  // 更新目标进度
  await updateObjectiveProgress(keyResult.objectiveId)

  return keyResult
}

/**
 * 删除关键结果
 */
export async function deleteKeyResult(id: string): Promise<boolean> {
  try {
    const keyResult = await prisma.keyResult.findUnique({
      where: { id }
    })

    if (!keyResult) return false

    await prisma.keyResult.delete({
      where: { id }
    })

    // 更新目标进度
    await updateObjectiveProgress(keyResult.objectiveId)

    return true
  } catch (error) {
    console.error('删除关键结果失败:', error)
    return false
  }
}

/**
 * 更新目标的整体进度
 */
export async function updateObjectiveProgress(objectiveId: string): Promise<void> {
  const objective = await prisma.objective.findUnique({
    where: { id: objectiveId },
    include: {
      keyResults: true
    }
  })

  if (!objective) return

  const keyResultsCount = objective.keyResults.length
  if (keyResultsCount === 0) {
    await prisma.objective.update({
      where: { id: objectiveId },
      data: { progress: 0 }
    })
    return
  }

  // 计算平均进度
  const totalProgress = objective.keyResults.reduce((sum, kr) => {
    const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0
    return sum + Math.min(progress, 100)
  }, 0)

  const averageProgress = Math.round(totalProgress / keyResultsCount)

  await prisma.objective.update({
    where: { id: objectiveId },
    data: { progress: averageProgress }
  })
}

/**
 * 获取 OKR 统计信息
 */
export async function getOKRStats() {
  const [total, byType, byStatus, activeCount] = await Promise.all([
    prisma.objective.count(),
    prisma.objective.groupBy({
      by: ['type'],
      _count: true,
      _avg: {
        progress: true
      }
    }),
    prisma.objective.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.objective.count({
      where: { status: 'ACTIVE' }
    })
  ])

  const totalKeyResults = await prisma.keyResult.count()

  return {
    objectives: {
      total,
      active: activeCount,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = {
          count: item._count,
          averageProgress: Math.round(item._avg.progress || 0)
        }
        return acc
      }, {} as Record<string, { count: number; averageProgress: number }>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
    },
    keyResults: {
      total: totalKeyResults
    }
  }
}

/**
 * 获取即将到期的目标
 */
export async function getUpcomingDeadlines(days: number = 7): Promise<ObjectiveWithKeyResults[]> {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(now.getDate() + days)

  const objectives = await prisma.objective.findMany({
    where: {
      status: 'ACTIVE',
      deadline: {
        gte: now,
        lte: futureDate
      }
    },
    include: {
      keyResults: true
    },
    orderBy: { deadline: 'asc' }
  })

  return objectives
}

/**
 * 完成目标
 */
export async function completeObjective(id: string): Promise<ObjectiveWithKeyResults | null> {
  const objective = await prisma.objective.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      progress: 100
    },
    include: {
      keyResults: true
    }
  })

  return objective
}

/**
 * 暂停目标
 */
export async function pauseObjective(id: string): Promise<ObjectiveWithKeyResults | null> {
  return updateObjective(id, { status: 'PAUSED' })
}

/**
 * 恢复目标
 */
export async function resumeObjective(id: string): Promise<ObjectiveWithKeyResults | null> {
  return updateObjective(id, { status: 'ACTIVE' })
}