import { NextRequest, NextResponse } from 'next/server'
import { createNote, getNotes } from '@/lib/notes'
import { NoteType, NoteStatus } from '@prisma/client'

// GET /api/notes - 获取笔记列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const queryOptions = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      type: searchParams.get('type') as NoteType || undefined,
      status: searchParams.get('status') as NoteStatus || undefined,
      isFavorite: searchParams.get('isFavorite') === 'true' ? true : (searchParams.get('isFavorite') === 'false' ? false : undefined),
      isPinned: searchParams.get('isPinned') === 'true' ? true : (searchParams.get('isPinned') === 'false' ? false : undefined),
      searchTerm: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') as any || 'updatedAt',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
      tagIds: searchParams.get('tagIds') ? searchParams.get('tagIds')?.split(',') : undefined
    }

    const result = await getNotes(queryOptions)
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('获取笔记列表失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取笔记列表失败'
    }, { status: 500 })
  }
}

// POST /api/notes - 创建新笔记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, content, type, status, isFavorite, isPinned, tagIds } = body
    
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        message: '标题和内容不能为空'
      }, { status: 400 })
    }

    const note = await createNote({
      title,
      content,
      type: type || 'GENERAL',
      status: status || 'DRAFT',
      isFavorite: isFavorite || false,
      isPinned: isPinned || false,
      tagIds
    })

    return NextResponse.json({
      success: true,
      data: note
    }, { status: 201 })
  } catch (error) {
    console.error('创建笔记失败:', error)
    return NextResponse.json({
      success: false,
      message: '创建笔记失败'
    }, { status: 500 })
  }
}