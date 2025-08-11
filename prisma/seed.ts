/**
 * 数据库种子文件
 * 用于初始化一些示例数据，帮助开发和测试
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种数据...')

  // 创建一些基础标签
  const tags = await Promise.all([
    // 读书相关标签
    prisma.tag.upsert({
      where: { name: '读书笔记' },
      update: {},
      create: {
        name: '读书笔记',
        color: '#2563eb',
        level: 0
      }
    }),
    prisma.tag.upsert({
      where: { name: '个人成长' },
      update: {},
      create: {
        name: '个人成长',
        color: '#059669',
        level: 0
      }
    }),
    prisma.tag.upsert({
      where: { name: '技术' },
      update: {},
      create: {
        name: '技术',
        color: '#7c3aed',
        level: 0
      }
    }),
    prisma.tag.upsert({
      where: { name: '思考' },
      update: {},
      create: {
        name: '思考',
        color: '#d97706',
        level: 0
      }
    }),
    prisma.tag.upsert({
      where: { name: '日记' },
      update: {},
      create: {
        name: '日记',
        color: '#db2777',
        level: 0
      }
    }),
  ])

  console.log(`✅ 创建了 ${tags.length} 个标签`)

  // 创建一些子标签
  const childTags = await Promise.all([
    // 技术相关子标签
    prisma.tag.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: {
        name: 'JavaScript',
        color: '#f59e0b',
        parentId: tags.find(t => t.name === '技术')?.id,
        level: 1
      }
    }),
    prisma.tag.upsert({
      where: { name: 'React' },
      update: {},
      create: {
        name: 'React',
        color: '#06b6d4',
        parentId: tags.find(t => t.name === '技术')?.id,
        level: 1
      }
    }),
    prisma.tag.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: {
        name: 'Next.js',
        color: '#000000',
        parentId: tags.find(t => t.name === '技术')?.id,
        level: 1
      }
    }),
  ])

  console.log(`✅ 创建了 ${childTags.length} 个子标签`)

  // 创建一些示例笔记
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        title: '欢迎来到 BOMO - 你的第二个大脑',
        content: `# 欢迎来到 BOMO

## 什么是 BOMO？

BOMO 是一个个人知识管理与成长系统，旨在成为你的"第二个大脑"。通过整合读书笔记、思维导图、目标规划、日常感悟等功能，构建统一的知识体系。

## 核心功能

- 📝 **统一笔记系统**: 支持 Markdown 格式的笔记管理
- 🏷️ **灵活标签体系**: 层级化的标签管理，建立知识关联
- 🎯 **OKR 目标管理**: 制定和追踪个人目标与关键结果
- 🧠 **思维导图**: 可视化思维整理
- 🔍 **智能搜索**: 全文搜索，快速定位内容
- 📊 **数据统计**: 了解你的学习和成长轨迹

## 开始使用

1. 创建你的第一个笔记
2. 添加标签进行分类
3. 设定你的目标和关键结果
4. 开始记录你的思考和成长

让我们一起构建你的知识王国！`,
        type: 'GENERAL',
        status: 'PUBLISHED',
        tags: {
          create: [
            { tagId: tags.find(t => t.name === '个人成长')?.id || '' },
            { tagId: tags.find(t => t.name === '思考')?.id || '' }
          ]
        }
      }
    }),

    prisma.note.create({
      data: {
        title: 'Next.js 14 学习笔记',
        content: `# Next.js 14 新特性学习

## App Router

Next.js 14 继续完善 App Router，带来了更好的开发体验：

- \`\`\`typescript
  // app/layout.tsx
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="zh">
        <body>{children}</body>
      </html>
    )
  }
  \`\`\`

## Server Components

服务器组件的优势：

1. **零客户端 JavaScript**: 减少包大小
2. **直接数据访问**: 可以直接访问数据库
3. **更好的 SEO**: 服务器渲染

## 学习心得

使用 Next.js 14 开发 BOMO 项目的过程中，深刻感受到了现代前端框架的强大。特别是：

- 类型安全的路由系统
- 优秀的开发者体验
- 内置的性能优化

## 下一步学习计划

- [ ] 深入学习 Server Actions
- [ ] 探索 Streaming 和 Suspense
- [ ] 研究性能优化最佳实践`,
        type: 'READING',
        status: 'PUBLISHED',
        tags: {
          create: [
            { tagId: tags.find(t => t.name === '技术')?.id || '' },
            { tagId: childTags.find(t => t.name === 'Next.js')?.id || '' },
            { tagId: childTags.find(t => t.name === 'React')?.id || '' }
          ]
        }
      }
    }),

    prisma.note.create({
      data: {
        title: '今日思考：知识管理的重要性',
        content: `# 今日思考

今天在实现 BOMO 项目的数据库设计时，深深感受到了良好的知识管理系统的重要性。

## 核心观点

> "你的大脑是用来产生想法的，不是用来储存想法的。" - David Allen

## 反思

在信息爆炸的时代，我们每天接收大量信息：
- 读书时的感悟
- 工作中的经验
- 生活中的思考

如果没有一个好的系统来记录和组织，这些宝贵的思考很容易就被遗忘了。

## 行动

这也是我开发 BOMO 的初衷 - 打造一个真正有效的个人知识管理系统，让每一个思考都能被很好地保存和利用。

## 今日收获

- 完成了数据库设计
- 深入理解了 Prisma ORM
- 对个人知识管理有了更深的认识`,
        type: 'INSIGHT',
        status: 'PUBLISHED',
        tags: {
          create: [
            { tagId: tags.find(t => t.name === '思考')?.id || '' },
            { tagId: tags.find(t => t.name === '个人成长')?.id || '' }
          ]
        }
      }
    }),

    prisma.note.create({
      data: {
        title: '项目开发待办事项',
        content: `# BOMO 项目开发计划

## 本周任务

- [x] 完成数据库设计和配置
- [x] 实现基础数据操作函数
- [ ] 开发笔记创建和编辑功能
- [ ] 实现标签管理页面
- [ ] 构建搜索功能

## 下周计划

- [ ] OKR 目标管理功能
- [ ] 思维导图集成
- [ ] 用户界面优化
- [ ] 移动端适配

## 技术债务

- [ ] 添加更多的类型验证
- [ ] 完善错误处理机制
- [ ] 编写单元测试
- [ ] 性能优化

## 长期目标

- [ ] MCP 接口开发
- [ ] 数据导出功能
- [ ] 离线支持
- [ ] 多设备同步`,
        type: 'TODO',
        status: 'PUBLISHED',
        tags: {
          create: [
            { tagId: tags.find(t => t.name === '技术')?.id || '' }
          ]
        }
      }
    }),
  ])

  console.log(`✅ 创建了 ${notes.length} 个示例笔记`)

  // 创建一个示例目标
  const objective = await prisma.objective.create({
    data: {
      title: '完成 BOMO 项目 MVP 版本',
      description: '在接下来的一个月内完成 BOMO 项目的最小可行产品（MVP）版本，包括核心的笔记管理、标签系统和 OKR 功能。',
      type: 'QUARTERLY',
      deadline: new Date('2025-09-10'),
      status: 'ACTIVE',
      keyResults: {
        create: [
          {
            description: '完成核心数据库设计和 API 开发',
            targetValue: 100,
            currentValue: 85,
            unit: '%'
          },
          {
            description: '完成前端界面开发',
            targetValue: 100,
            currentValue: 20,
            unit: '%'
          },
          {
            description: '编写项目文档',
            targetValue: 100,
            currentValue: 10,
            unit: '%'
          },
          {
            description: '完成基础功能测试',
            targetValue: 100,
            currentValue: 0,
            unit: '%'
          }
        ]
      }
    },
    include: {
      keyResults: true
    }
  })

  console.log(`✅ 创建了 1 个示例目标，包含 ${objective.keyResults.length} 个关键结果`)

  // 创建一个示例思维导图
  const mindMap = await prisma.mindMap.create({
    data: {
      title: 'BOMO 项目架构',
      data: JSON.stringify({
        nodes: [
          { id: '1', data: { label: 'BOMO 系统' }, position: { x: 0, y: 0 }, type: 'default' },
          { id: '2', data: { label: '笔记系统' }, position: { x: -200, y: 100 }, type: 'default' },
          { id: '3', data: { label: '标签系统' }, position: { x: 0, y: 100 }, type: 'default' },
          { id: '4', data: { label: 'OKR 系统' }, position: { x: 200, y: 100 }, type: 'default' },
          { id: '5', data: { label: '搜索功能' }, position: { x: -100, y: 200 }, type: 'default' },
          { id: '6', data: { label: '思维导图' }, position: { x: 100, y: 200 }, type: 'default' }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e1-3', source: '1', target: '3' },
          { id: 'e1-4', source: '1', target: '4' },
          { id: 'e1-5', source: '1', target: '5' },
          { id: 'e1-6', source: '1', target: '6' }
        ]
      }),
      noteId: notes[0].id
    }
  })

  console.log(`✅ 创建了 1 个示例思维导图`)

  console.log('🎉 数据播种完成！')
  
  // 显示创建的数据统计
  const stats = await Promise.all([
    prisma.note.count(),
    prisma.tag.count(),
    prisma.objective.count(),
    prisma.keyResult.count(),
    prisma.mindMap.count()
  ])

  console.log('\n📊 数据统计:')
  console.log(`- 笔记: ${stats[0]} 条`)
  console.log(`- 标签: ${stats[1]} 个`)
  console.log(`- 目标: ${stats[2]} 个`)
  console.log(`- 关键结果: ${stats[3]} 个`)
  console.log(`- 思维导图: ${stats[4]} 个`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ 数据播种失败:', e)
    await prisma.$disconnect()
    process.exit(1)
  })