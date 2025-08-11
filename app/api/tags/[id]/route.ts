import { NextRequest, NextResponse } from 'next/server'
import { 
  getTagById, 
  updateTag, 
  deleteTag, 
  getTagPath,
  type UpdateTagData
} from '@/lib/tags'
import { z } from 'zod'

// 更新标签的验证 schema
const updateTagSchema = z.object({
  name: z.string().min(1, '标签名称不能为空').max(50, '标签名称不能超过50个字符').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, '颜色格式必须是有效的HEX值').optional(),
  parentId: z.string().nullable().optional()
})

/**
 * GET /api/tags/[id] - 获取标签详情
 * 查询参数:
 * - path: 'true' - 是否返回标签路径
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includePath = searchParams.get('path') === 'true'

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

    let result: any = tag

    // 如果需要标签路径
    if (includePath) {
      const path = await getTagPath(params.id)
      result = {
        ...tag,
        path
      }
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('获取标签详情失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取标签详情失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/tags/[id] - 更新标签
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validatedData = updateTagSchema.parse(body)

    // 检查标签是否存在
    const existingTag = await getTagById(params.id)
    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: '标签不存在',
          message: `未找到ID为 "${params.id}" 的标签`
        },
        { status: 404 }
      )
    }

    // 如果要更新名称，检查是否与其他标签重复
    if (validatedData.name && validatedData.name !== existingTag.name) {
      const { searchTags } = await import('@/lib/tags')
      const existingTags = await searchTags(validatedData.name)
      const exactMatch = existingTags.find(tag => 
        tag.name.toLowerCase() === validatedData.name.toLowerCase() && 
        tag.id !== params.id
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
    }

    // 如果要更改父标签，检查是否会形成循环引用
    if (validatedData.parentId !== undefined) {
      if (validatedData.parentId === params.id) {
        return NextResponse.json(
          {
            success: false,
            error: '不能将标签设为自己的子标签',
            message: '标签不能成为自己的父标签'
          },
          { status: 400 }
        )
      }

      // 检查是否会形成循环引用（父标签不能是当前标签的子标签）
      if (validatedData.parentId) {
        const parentPath = await getTagPath(validatedData.parentId)
        if (parentPath.some(path => path.includes(existingTag.name))) {
          return NextResponse.json(
            {
              success: false,
              error: '不能形成循环引用',
              message: '不能将标签的子标签设为其父标签'
            },
            { status: 400 }
          )
        }
      }
    }

    // 更新标签
    const updatedTag = await updateTag(params.id, validatedData)

    return NextResponse.json({
      success: true,
      data: updatedTag,
      message: '标签更新成功'
    })
  } catch (error) {
    console.error('更新标签失败:', error)
    
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
        error: '更新标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tags/[id] - 删除标签
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查标签是否存在
    const existingTag = await getTagById(params.id)
    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: '标签不存在',
          message: `未找到ID为 "${params.id}" 的标签`
        },
        { status: 404 }
      )
    }

    // 删除标签
    const success = await deleteTag(params.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '删除标签失败',
          message: '可能存在关联的子标签，请先删除所有子标签'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '标签删除成功'
    })
  } catch (error) {
    console.error('删除标签失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '删除标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}