import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllTags, 
  getRootTags, 
  getTagTree, 
  createTag, 
  searchTags,
  getTagStats,
  type CreateTagData
} from '@/lib/tags'
import { z } from 'zod'

// 创建标签的验证 schema
const createTagSchema = z.object({
  name: z.string().min(1, '标签名称不能为空').max(50, '标签名称不能超过50个字符'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '颜色格式必须是有效的HEX值').optional(),
  parentId: z.string().optional()
})

/**
 * GET /api/tags - 获取标签列表
 * 查询参数:
 * - view: 'all' | 'root' | 'tree' - 视图类型
 * - search: string - 搜索关键词
 * - stats: 'true' - 是否返回统计信息
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'all'
    const search = searchParams.get('search')
    const includeStats = searchParams.get('stats') === 'true'

    // 如果请求统计信息
    if (includeStats) {
      const stats = await getTagStats()
      return NextResponse.json({
        success: true,
        data: stats
      })
    }

    // 如果有搜索关键词
    if (search) {
      const tags = await searchTags(search.trim())
      return NextResponse.json({
        success: true,
        data: tags
      })
    }

    // 根据视图类型返回不同数据
    let tags
    switch (view) {
      case 'root':
        tags = await getRootTags()
        break
      case 'tree':
        tags = await getTagTree()
        break
      default:
        tags = await getAllTags()
        break
    }

    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取标签列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tags - 创建新标签
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = createTagSchema.parse(body)

    // 检查标签名称是否已存在
    const existingTags = await searchTags(validatedData.name)
    const exactMatch = existingTags.find(tag => 
      tag.name.toLowerCase() === validatedData.name.toLowerCase()
    )
    
    if (exactMatch) {
      return NextResponse.json(
        {
          success: false,
          error: '标签名称已存在',
          message: `标签"${validatedData.name}"已存在，请使用其他名称`
        },
        { status: 400 }
      )
    }

    // 创建标签
    const tag = await createTag(validatedData)

    return NextResponse.json(
      {
        success: true,
        data: tag,
        message: '标签创建成功'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建标签失败:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          message: error.errors[0]?.message || '请检查输入数据',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: '创建标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}