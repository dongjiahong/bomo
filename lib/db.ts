/**
 * 数据库连接和基础操作工具
 * 提供 Prisma Client 的单例实例和基础数据库操作函数
 */

import { PrismaClient } from '@prisma/client'

// 全局声明 Prisma 实例，避免在开发模式下重复创建
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建 Prisma Client 单例
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 数据库连接状态检查
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('数据库连接失败:', error)
    return false
  }
}

// 优雅关闭数据库连接
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
}

// 类型导出，便于其他文件使用
export type { 
  Note, 
  Tag, 
  TagRelation, 
  MindMap, 
  Objective, 
  KeyResult,
  NoteType,
  NoteStatus,
  ObjectiveType,
  ObjectiveStatus
} from '@prisma/client'