/**
 * 数据库连接和功能测试脚本
 * 用于验证数据库配置是否正确
 */

import { checkDatabaseConnection, prisma } from './db'
import { getNotes } from './notes'
import { getAllTags } from './tags'
import { getObjectives } from './objectives'

async function testDatabase() {
  console.log('🔍 开始数据库功能测试...')

  try {
    // 测试数据库连接
    console.log('1. 测试数据库连接...')
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      throw new Error('数据库连接失败')
    }
    console.log('✅ 数据库连接正常')

    // 测试笔记功能
    console.log('2. 测试笔记功能...')
    const notesResult = await getNotes({ limit: 3 })
    console.log(`✅ 成功获取 ${notesResult.notes.length} 条笔记`)
    if (notesResult.notes.length > 0) {
      console.log(`   - 最新笔记: "${notesResult.notes[0].title}"`)
    }

    // 测试标签功能
    console.log('3. 测试标签功能...')
    const tags = await getAllTags()
    console.log(`✅ 成功获取 ${tags.length} 个标签`)
    const rootTags = tags.filter(t => t.level === 0)
    console.log(`   - 根级标签: ${rootTags.length} 个`)

    // 测试目标功能
    console.log('4. 测试目标功能...')
    const objectivesResult = await getObjectives({ limit: 3 })
    console.log(`✅ 成功获取 ${objectivesResult.objectives.length} 个目标`)
    if (objectivesResult.objectives.length > 0) {
      const firstObjective = objectivesResult.objectives[0]
      console.log(`   - 目标: "${firstObjective.title}"`)
      console.log(`   - 进度: ${firstObjective.progress}%`)
    }

    // 测试数据统计
    console.log('5. 测试数据统计...')
    const stats = await Promise.all([
      prisma.note.count(),
      prisma.tag.count(),
      prisma.objective.count(),
      prisma.keyResult.count(),
      prisma.mindMap.count(),
      prisma.tagRelation.count()
    ])

    console.log('✅ 数据库统计:')
    console.log(`   - 笔记: ${stats[0]} 条`)
    console.log(`   - 标签: ${stats[1]} 个`)
    console.log(`   - 目标: ${stats[2]} 个`)
    console.log(`   - 关键结果: ${stats[3]} 个`)
    console.log(`   - 思维导图: ${stats[4]} 个`)
    console.log(`   - 标签关联: ${stats[5]} 条`)

    console.log('🎉 所有数据库功能测试通过！')
    return true

  } catch (error) {
    console.error('❌ 数据库测试失败:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testDatabase().then((success) => {
    process.exit(success ? 0 : 1)
  })
}

export { testDatabase }