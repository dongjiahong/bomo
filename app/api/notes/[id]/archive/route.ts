import { NextRequest, NextResponse } from 'next/server'
import { archiveNote } from '@/lib/notes'

// POST /api/notes/[id]/archive - 归档笔记
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

    const note = await archiveNote(id)
    
    if (!note) {
      return NextResponse.json({
        success: false,
        message: '笔记不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: note,
      message: '已归档'
    })
  } catch (error) {
    console.error('归档操作失败:', error)
    return NextResponse.json({
      success: false,
      message: '归档操作失败'
    }, { status: 500 })
  }
}