import Link from 'next/link';
import { Container, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Grid, Flex } from '@/components/ui';

export default function Home() {
  return (
    <Container size="xl" className="min-h-screen py-12">
      <main className="text-center">
        {/* 标题部分 */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-gradient mb-6">
            BOMO
          </h1>
          <p className="text-2xl text-neutral-600 mb-4">
            第二个大脑：个人知识管理与成长系统
          </p>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-8">
            基于 Next.js 14、TypeScript 和 Tailwind CSS 构建的现代化知识管理平台
          </p>
          
          <Flex justify="center" gap="md">
            <Link href="/components">
              <Button size="lg" className="shadow-brand-lg">
                查看组件库
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              开始使用
            </Button>
          </Flex>
        </div>

        {/* 特性展示 */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-12">核心特性</h2>
          <Grid cols={1} gap="md" responsive={{ md: 2, lg: 3 }}>
            <Card variant="elevated" hoverable className="text-left">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <CardTitle>知识管理</CardTitle>
                <CardDescription>
                  强大的知识组织和管理功能，帮助你构建个人知识体系
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="elevated" hoverable className="text-left">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6" />
                    <path d="m21 12-6-6m-6 6-6-6" />
                  </svg>
                </div>
                <CardTitle>智能分析</CardTitle>
                <CardDescription>
                  基于 AI 的内容分析和推荐，发现知识间的潜在联系
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="elevated" hoverable className="text-left">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <CardTitle>成长追踪</CardTitle>
                <CardDescription>
                  记录学习轨迹，可视化知识成长过程和学习效果
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>
        </div>

        {/* 技术栈展示 */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-12">技术栈</h2>
          <Card variant="outlined" className="p-8">
            <Grid cols={2} gap="lg" responsive={{ md: 4 }}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <h3 className="font-semibold text-neutral-900">Next.js 14</h3>
                <p className="text-sm text-neutral-600">App Router</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  TS
                </div>
                <h3 className="font-semibold text-neutral-900">TypeScript</h3>
                <p className="text-sm text-neutral-600">严格模式</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  TW
                </div>
                <h3 className="font-semibold text-neutral-900">Tailwind CSS</h3>
                <p className="text-sm text-neutral-600">原子化CSS</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  P
                </div>
                <h3 className="font-semibold text-neutral-900">Prisma</h3>
                <p className="text-sm text-neutral-600">数据库 ORM</p>
              </div>
            </Grid>
          </Card>
        </div>

        {/* 底部信息 */}
        <footer className="text-center text-neutral-500">
          <p>© 2023 BOMO. 构建你的第二个大脑.</p>
        </footer>
      </main>
    </Container>
  );
}
