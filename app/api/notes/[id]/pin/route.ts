import { NextRequest, NextResponse } from 'next/server'
import { togglePinNote } from '@/lib/notes'

// POST /api/notes/[id]/pin - 置顶/取消置顶笔记
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

    const note = await togglePinNote(id)
    
    if (!note) {
      return NextResponse.json({
        success: false,
        message: '笔记不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: note,
      message: note.isPinned ? '已置顶' : '已取消置顶'
    })
  } catch (error) {
    console.error('置顶操作失败:', error)
    return NextResponse.json({
      success: false,
      message: '置顶操作失败'
    }, { status: 500 })
  }
}