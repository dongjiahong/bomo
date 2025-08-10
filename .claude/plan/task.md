# 项目计划：BOMO - 第二个大脑

**最后更新时间:** 2025-08-10 02:15
**已经完成的任务:** 5/58
**正在完成的任务:** Epic 1.1 项目初始化 (100%完成) ✅

---

## 1. 项目概述

BOMO 是一个个人知识管理与成长系统，致力于成为用户的"第二个大脑"。通过整合读书笔记、思维导图、目标规划、日常感悟等功能，构建统一的知识体系，在关键时刻为用户提供智慧支撑。

**核心价值定位:**

- 🧠 第二个大脑：整合个人所有知识和思考
- 🎯 智慧决策：在重要时刻提供过往智慧的指导
- 🌱 持续成长：通过回顾和反思促进个人发展
- 🔗 知识关联：通过标签系统建立知识间的有机联系

**设计理念:**
"简约但不简单，有个性但不从众" - 追求功能的纯粹性和视觉的独特性

**技术栈:**

- **框架:** Next.js 14 (App Router)
- **语言:** TypeScript
- **包管理:** yarn
- **样式:** Tailwind CSS + 自定义组件系统
- **数据库:** SQLite + Prisma ORM
- **部署:** 本地开发端口8080，host 0.0.0.0

---

## 2. 核心功能路线图 (Roadmap)

### 阶段一：基础架构与核心功能 (MVP)

#### Epic 1: 项目基础架构

- [x] **1.1 项目初始化** ✅ **100% 完成**
  - [x] 创建 Next.js 14 项目 (yarn create next-app) ✅ 已完成
  - [x] 配置 TypeScript 严格模式 ✅ 已完成
  - [x] 设置开发环境 (端口8080, host 0.0.0.0) ✅ 已完成
  - [x] 配置 ESLint 和 Prettier 代码规范 ✅ 已完成
  - [x] 设置 Git 仓库和基础 .gitignore ✅ 已完成

- [ ] **1.2 UI设计系统搭建**
  - [ ] 安装和配置 Tailwind CSS
  - [ ] 设计核心色彩系统 (体现简约而有个性的风格)
  - [ ] 创建基础组件库 (Button, Card, Input, Modal等)
  - [ ] 设计独特的Logo和品牌标识
  - [ ] 建立响应式布局系统

- [ ] **1.3 数据库设计与配置**
  - [ ] 安装和配置 Prisma ORM
  - [ ] 设计核心数据表结构 (Notes, Tags, TagRelations等)
  - [ ] 创建数据库迁移文件
  - [ ] 初始化 SQLite 数据库
  - [ ] 创建基础数据操作函数

#### Epic 2: 统一笔记系统

- [ ] **2.1 笔记核心功能**
  - [ ] 创建笔记创建/编辑页面
  - [ ] 实现 Markdown 编辑器 (实时预览)
  - [ ] 构建笔记列表展示页面
  - [ ] 实现笔记的CRUD操作API
  - [ ] 添加自动保存功能

- [ ] **2.2 笔记分类和组织**
  - [ ] 实现笔记类型分类 (读书笔记、日记、感悟等)
  - [ ] 创建笔记归档功能
  - [ ] 实现笔记排序和筛选
  - [ ] 添加笔记收藏和置顶功能
  - [ ] 设计优雅的空状态页面

#### Epic 3: 灵活标签系统

- [ ] **3.1 标签基础功能**
  - [ ] 创建标签管理页面
  - [ ] 实现标签的CRUD操作
  - [ ] 设计标签的层级结构
  - [ ] 实现标签颜色自定义
  - [ ] 构建标签-内容关联系统

- [ ] **3.2 读书9维度标签体系**
  - [ ] 预设读书相关的9个核心标签类别
  - [ ] 实现标签的智能推荐功能
  - [ ] 创建标签使用统计页面
  - [ ] 实现标签快速分配工具
  - [ ] 设计标签可视化图表

#### Epic 4: 本地检索系统

- [ ] **4.1 搜索核心功能**
  - [ ] 实现全文搜索功能
  - [ ] 构建基于标签的筛选搜索
  - [ ] 创建搜索结果页面
  - [ ] 实现搜索历史记录
  - [ ] 添加搜索建议和自动完成

- [ ] **4.2 搜索体验优化**
  - [ ] 实现搜索结果高亮显示
  - [ ] 添加高级搜索选项 (时间范围、内容类型等)
  - [ ] 创建搜索结果的智能排序
  - [ ] 实现相关内容推荐
  - [ ] 优化搜索性能 (索引、缓存)

### 阶段二：高级功能模块

#### Epic 5: 思维导图功能

- [ ] **5.1 思维导图编辑器**
  - [ ] 选择并集成思维导图库 (如 react-flow 或 d3.js)
  - [ ] 创建思维导图编辑页面
  - [ ] 实现节点的创建、编辑、删除
  - [ ] 支持节点的拖拽和连线
  - [ ] 实现思维导图的保存和加载

- [ ] **5.2 思维导图高级功能**
  - [ ] 实现多种节点样式和主题
  - [ ] 添加思维导图导出功能 (PNG, PDF)
  - [ ] 创建思维导图模板系统
  - [ ] 实现思维导图与笔记的关联
  - [ ] 添加协作和分享功能

#### Epic 6: OKR人生规划模块

- [ ] **6.1 OKR基础功能**
  - [ ] 创建OKR设定页面 (目标和关键结果)
  - [ ] 实现OKR进度追踪功能
  - [ ] 构建OKR仪表盘页面
  - [ ] 添加OKR完成度可视化
  - [ ] 实现OKR的周期管理 (季度/年度)

- [ ] **6.2 OKR高级功能**
  - [ ] 创建OKR复盘和总结功能
  - [ ] 实现目标与笔记的关联
  - [ ] 添加进度提醒和通知
  - [ ] 构建OKR历史回顾页面
  - [ ] 实现OKR数据分析和报表

#### Epic 7: 多元内容模块

- [ ] **7.1 日记和感悟**
  - [ ] 创建日记写作页面
  - [ ] 实现临时感悟快速记录
  - [ ] 构建情绪标记功能
  - [ ] 添加日记的时间轴展示
  - [ ] 实现日记的隐私保护

- [ ] **7.2 ToDo管理**
  - [ ] 创建任务管理页面
  - [ ] 实现任务的优先级设置
  - [ ] 添加任务截止时间和提醒
  - [ ] 构建任务完成统计
  - [ ] 实现任务与目标的关联

#### Epic 8: 随机回顾功能

- [ ] **8.1 智能推荐算法**
  - [ ] 设计基于遗忘曲线的推荐算法
  - [ ] 实现用户偏好学习系统
  - [ ] 创建内容权重评估机制
  - [ ] 构建推荐内容去重逻辑
  - [ ] 实现推荐效果反馈收集

- [ ] **8.2 回顾体验优化**
  - [ ] 创建每日回顾页面
  - [ ] 实现回顾内容的个性化展示
  - [ ] 添加回顾历史和统计
  - [ ] 构建回顾提醒机制
  - [ ] 实现回顾内容的二次编辑

### 阶段三：开放互联与优化

#### Epic 9: MCP对外接口

- [ ] **9.1 MCP协议实现**
  - [ ] 研究和理解MCP协议规范
  - [ ] 设计API接口结构
  - [ ] 实现基础的CRUD接口
  - [ ] 添加接口认证和权限控制
  - [ ] 创建接口文档和示例

- [ ] **9.2 接口功能完善**
  - [ ] 实现数据同步接口
  - [ ] 添加批量操作接口
  - [ ] 创建Webhook支持
  - [ ] 实现接口监控和日志
  - [ ] 构建接口测试套件

#### Epic 10: 系统优化与完善

- [ ] **10.1 性能优化**
  - [ ] 实现数据库查询优化
  - [ ] 添加前端缓存策略
  - [ ] 优化图片和资源加载
  - [ ] 实现虚拟滚动 (大数据量列表)
  - [ ] 构建性能监控系统

- [ ] **10.2 用户体验优化**
  - [ ] 实现离线功能支持
  - [ ] 添加数据备份和恢复
  - [ ] 创建用户引导和帮助系统
  - [ ] 实现主题切换功能
  - [ ] 优化移动端体验

---

## 3. 数据库设计 (简化版)

```sql
-- 核心数据表结构
Notes {
  id: String (UUID)
  title: String
  content: Text (Markdown)
  type: Enum (reading, diary, insight, todo, objective)
  status: Enum (draft, published, archived)
  created_at: DateTime
  updated_at: DateTime
  user_id: String
}

Tags {
  id: String (UUID)
  name: String
  color: String (HEX)
  parent_id: String? (自引用，支持层级)
  level: Int (标签层级)
  created_at: DateTime
}

TagRelations {
  id: String (UUID)
  note_id: String
  tag_id: String
  created_at: DateTime
}

MindMaps {
  id: String (UUID)
  title: String
  data: JSON (节点和连接数据)
  note_id: String? (关联笔记)
  created_at: DateTime
  updated_at: DateTime
}

Objectives {
  id: String (UUID)
  title: String
  description: Text
  type: Enum (quarterly, yearly, lifetime)
  deadline: DateTime
  progress: Float (0-100)
  status: Enum (active, completed, paused)
  created_at: DateTime
  updated_at: DateTime
}

KeyResults {
  id: String (UUID)
  objective_id: String
  description: String
  target_value: Float
  current_value: Float
  unit: String
  created_at: DateTime
  updated_at: DateTime
}
```

---

## 4. UI设计理念详述

### 4.1 视觉设计原则

**"简约但不简单，有个性但不从众"**

- **简约但不简单**: 界面清爽不冗余，但功能层次丰富
- **有个性但不从众**: 独特的视觉标识，避免千篇一律的设计

### 4.2 色彩系统

```css
/* 主色调 - 温暖智慧蓝 */
--primary: #2563eb /* 深蓝，象征深度思考 */ --primary-light: #60a5fa /* 浅蓝，象征灵感闪现 */
  --primary-dark: #1d4ed8 /* 暗蓝，象征专注状态 */ /* 辅助色 - 知识金 */ --secondary: #f59e0b
  /* 金色，象征珍贵知识 */ --secondary-light: #fbbf24 --secondary-dark: #d97706
  /* 中性色 - 纸张白与墨水灰 */ --background: #fefefe /* 温暖的纸张白 */ --surface: #f8fafc
  /* 卡片背景 */ --text-primary: #1e293b /* 墨水灰 */ --text-secondary: #64748b /* 次要文字 */;
```

### 4.3 字体系统

- **标题**: "Inter" - 现代、清晰、权威感
- **正文**: "Source Han Sans" - 优秀的中文渲染
- **代码**: "JetBrains Mono" - 等宽，代码友好

### 4.4 组件设计特色

- **卡片设计**: 轻微阴影，圆角适中，体现内容的独立性
- **按钮设计**: 微渐变效果，状态变化流畅
- **图标系统**: 统一风格的线性图标，简洁而富有表现力

---

## 5. MCP接口规范

### 5.1 接口设计原则

- 遵循RESTful设计规范
- 统一的错误处理和状态码
- 完整的接口文档和示例
- 支持版本控制和向后兼容

### 5.2 核心接口列表

```
GET    /api/mcp/notes          # 获取笔记列表
POST   /api/mcp/notes          # 创建新笔记
GET    /api/mcp/notes/:id      # 获取单个笔记
PUT    /api/mcp/notes/:id      # 更新笔记
DELETE /api/mcp/notes/:id      # 删除笔记

GET    /api/mcp/tags           # 获取标签列表
POST   /api/mcp/tags           # 创建新标签
GET    /api/mcp/search         # 全文搜索接口
GET    /api/mcp/random         # 随机回顾接口

POST   /api/mcp/sync           # 数据同步接口
GET    /api/mcp/export         # 数据导出接口
```

### 5.3 数据格式示例

```json
// 笔记对象
{
  "id": "uuid-string",
  "title": "笔记标题",
  "content": "Markdown内容",
  "type": "reading",
  "tags": ["tag1", "tag2"],
  "created_at": "2025-08-10T00:00:00Z",
  "updated_at": "2025-08-10T00:00:00Z"
}

// API响应格式
{
  "success": true,
  "data": { /* 数据内容 */ },
  "message": "操作成功",
  "timestamp": "2025-08-10T00:00:00Z"
}
```

---

## 6. 开发环境配置

### 6.1 环境要求

- Node.js 18.17+
- yarn 1.22+
- SQLite 3.40+

### 6.2 启动配置

```json
// package.json scripts
{
  "dev": "next dev --port 8080 --hostname 0.0.0.0",
  "build": "next build",
  "start": "next start --port 8080 --hostname 0.0.0.0",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio"
}
```

### 6.3 目录结构规划

```
/bomo
├── app/                 # Next.js App Router
│   ├── (dashboard)/     # 主应用路由组
│   ├── api/            # API路由
│   └── globals.css     # 全局样式
├── components/         # 共享组件
│   ├── ui/            # 基础UI组件
│   └── features/      # 功能组件
├── lib/               # 工具函数
│   ├── db.ts         # 数据库操作
│   └── utils.ts      # 通用工具
├── prisma/            # Prisma配置
│   └── schema.prisma  # 数据模型
└── public/            # 静态资源
```

---

## 7. 当前任务讨论记录

🎉 **里程碑达成: Epic 1.1 项目初始化 100% 完成！**

✅ **Epic 1.1 已完成的所有任务 (5/5):**
1. ✅ 创建 Next.js 14 项目 - 项目结构已搭建
2. ✅ 配置 TypeScript 严格模式 - 类型检查已启用  
3. ✅ 设置开发环境配置 - 端口8080和host 0.0.0.0已配置
4. ✅ 配置 ESLint 和 Prettier - 代码规范已建立
5. ✅ 设置 Git 仓库和基础 .gitignore - 版本控制已就绪

---

🚀 **准备开始下一阶段: Epic 1.2 UI设计系统搭建**

这是一个关键阶段，我们将构建 BOMO 独特的视觉识别系统，体现"简约但不简单，有个性但不从众"的设计理念。

**Epic 1.2 的核心任务包括:**
1. 🎨 安装和配置 Tailwind CSS - 现代化的样式框架
2. 🌈 设计核心色彩系统 - 温暖智慧蓝 + 知识金的配色方案
3. 🔧 创建基础组件库 - 统一风格的 Button, Card, Input, Modal 等
4. 🎯 设计独特的Logo和品牌标识 - 体现"第二个大脑"的概念
5. 📱 建立响应式布局系统 - 适配各种设备

**建议:** 根据项目规划，下一个最高优先级的任务是开始 **Epic 1.2: UI设计系统搭建**。我们准备好开始了吗？

我们可以从安装 Tailwind CSS 开始，然后逐步建立整个设计系统。这将为后续的所有功能开发奠定坚实的视觉基础！
