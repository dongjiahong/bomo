import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTagById } from '@/lib/tags'

/**
 * GET /api/tags/[id]/notes - 获取标签关联的所有笔记
 * 查询参数:
 * - limit: number - 限制返回数量
 * - offset: number - 偏移量（分页）
 * - status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' - 按状态过滤
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    // 检查标签是否存在
    const tag = await getTagById(params.id)
    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: '标签不存在',
          message: `未找到ID为 "${params.id}" 的标签`
        },
        { status: 404 }
      )
    }

    // 构建查询条件
    const whereCondition: any = {
      tags: {
        some: {
          tagId: params.id
        }
      }
    }

    if (status) {
      whereCondition.status = status
    }

    // 获取关联的笔记
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: whereCondition,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.note.count({
        where: whereCondition
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        notes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        },
        tag
      }
    })
  } catch (error) {
    console.error('获取标签关联笔记失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取标签关联笔记失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}