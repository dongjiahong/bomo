import { NextRequest, NextResponse } from 'next/server'
import { getNoteById, updateNote, deleteNote } from '@/lib/notes'
import { NoteType, NoteStatus } from '@prisma/client'

// GET /api/notes/[id] - 获取单个笔记
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await getNoteById(params.id)
    
    if (!note) {
      return NextResponse.json({
        success: false,
        message: '笔记不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: note
    })
  } catch (error) {
    console.error('获取笔记失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取笔记失败'
    }, { status: 500 })
  }
}

// PUT /api/notes/[id] - 更新笔记
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, type, status, isFavorite, isPinned, tagIds } = body

    const note = await updateNote(params.id, {
      title,
      content,
      type: type as NoteType,
      status: status as NoteStatus,
      isFavorite,
      isPinned,
      tagIds
    })

    if (!note) {
      return NextResponse.json({
        success: false,
        message: '笔记不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: note
    })
  } catch (error) {
    console.error('更新笔记失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新笔记失败'
    }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - 删除笔记
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteNote(params.id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: '删除笔记失败'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '笔记已删除'
    })
  } catch (error) {
    console.error('删除笔记失败:', error)
    return NextResponse.json({
      success: false,
      message: '删除笔记失败'
    }, { status: 500 })
  }
}