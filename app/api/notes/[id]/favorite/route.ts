import { NextRequest, NextResponse } from 'next/server'
import { toggleFavoriteNote } from '@/lib/notes'

// POST /api/notes/[id]/favorite - 收藏/取消收藏笔记
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: '笔记ID不能为空'
      }, { status: 400 })
    }

    const note = await toggleFavoriteNote(id)
    
    if (!note) {
      return NextResponse.json({
        success: false,
        message: '笔记不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: note,
      message: note.isFavorite ? '已收藏' : '已取消收藏'
    })
  } catch (error) {
    console.error('收藏操作失败:', error)
    return NextResponse.json({
      success: false,
      message: '收藏操作失败'
    }, { status: 500 })
  }
}