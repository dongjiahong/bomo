'use client';

import React from 'react';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  LinkButton,
  DestructiveButton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FeatureCard,
  StatsCard,
  Input,
  Textarea,
  SearchInput,
  Form,
  FormField,
  FormLabel,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ConfirmModal,
  AlertModal,
  Container,
  Grid,
  GridItem,
  Flex,
  Stack,
  Divider,
  EmptyState
} from '@/components/ui';

export default function ComponentsPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showAlertModal, setShowAlertModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container size="xl" className="py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          BOMO UI 组件库
        </h1>
        <p className="text-lg text-neutral-600">
          完整的设计系统展示，包含所有基础 UI 组件
        </p>
      </div>

      <Stack spacing="xl" divider={<Divider />}>
        {/* 颜色系统展示 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">色彩系统</h2>
          <Grid cols={1} gap="md" responsive={{ md: 2, lg: 3 }}>
            {/* 主色调 */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>智慧蓝 (Primary)</CardTitle>
                <CardDescription>品牌主色，传达智慧与专业</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-500 rounded"></div>
                    <span className="text-sm">Primary 500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-600 rounded"></div>
                    <span className="text-sm">Primary 600</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-700 rounded"></div>
                    <span className="text-sm">Primary 700</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 辅助色调 */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>知识金 (Secondary)</CardTitle>
                <CardDescription>辅助色调，突出重要信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary-400 rounded"></div>
                    <span className="text-sm">Secondary 400</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary-500 rounded"></div>
                    <span className="text-sm">Secondary 500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary-600 rounded"></div>
                    <span className="text-sm">Secondary 600</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 成长绿 */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>成长绿 (Accent)</CardTitle>
                <CardDescription>成功状态，积极反馈</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-accent-400 rounded"></div>
                    <span className="text-sm">Accent 400</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-accent-500 rounded"></div>
                    <span className="text-sm">Accent 500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-accent-600 rounded"></div>
                    <span className="text-sm">Accent 600</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* 按钮组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">按钮组件</h2>
          
          <Grid cols={1} gap="lg" responsive={{ lg: 2 }}>
            <Card>
              <CardHeader>
                <CardTitle>按钮变体</CardTitle>
                <CardDescription>不同样式的按钮用于不同场景</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack spacing="md">
                  <Flex gap="md" wrap="wrap">
                    <PrimaryButton>主要按钮</PrimaryButton>
                    <SecondaryButton>次要按钮</SecondaryButton>
                    <OutlineButton>轮廓按钮</OutlineButton>
                    <GhostButton>幽灵按钮</GhostButton>
                    <LinkButton>链接按钮</LinkButton>
                    <DestructiveButton>危险按钮</DestructiveButton>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>按钮尺寸 & 状态</CardTitle>
                <CardDescription>不同尺寸和加载状态</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack spacing="md">
                  <Flex gap="md" wrap="wrap" align="center">
                    <Button size="sm">小按钮</Button>
                    <Button size="md">中按钮</Button>
                    <Button size="lg">大按钮</Button>
                    <Button size="xl">超大按钮</Button>
                  </Flex>
                  <Flex gap="md" wrap="wrap">
                    <Button loading={loading} onClick={handleLoadingDemo}>
                      {loading ? '加载中...' : '点击加载'}
                    </Button>
                    <Button disabled>禁用状态</Button>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* 卡片组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">卡片组件</h2>
          
          <Grid cols={1} gap="md" responsive={{ md: 2, lg: 3 }}>
            <FeatureCard
              title="功能卡片"
              description="这是一个带图标和操作的功能卡片"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
              action={<Button size="sm">了解更多</Button>}
            />

            <StatsCard
              title="活跃用户"
              value="2,543"
              subtitle="本月新增"
              trend="up"
              trendValue="+12.5%"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="m22 21-3-3m0 0a6 6 0 1 0-6-6 6 6 0 0 0 6 6z" />
                </svg>
              }
            />

            <Card variant="elevated" hoverable>
              <CardHeader separator>
                <CardTitle>自定义卡片</CardTitle>
                <CardDescription>完全可自定义的卡片组件</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700">
                  这个卡片支持悬停效果，可以自定义各个部分的内容。
                </p>
              </CardContent>
              <CardFooter separator>
                <Flex justify="between" className="w-full">
                  <span className="text-sm text-neutral-500">2023-12-25</span>
                  <Button size="sm" variant="ghost">查看详情</Button>
                </Flex>
              </CardFooter>
            </Card>
          </Grid>
        </section>

        {/* 表单组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">表单组件</h2>
          
          <Grid cols={1} gap="lg" responsive={{ lg: 2 }}>
            <Card>
              <CardHeader>
                <CardTitle>基础表单</CardTitle>
                <CardDescription>各种输入组件的展示</CardDescription>
              </CardHeader>
              <CardContent>
                <Form spacing="md">
                  <FormField>
                    <FormLabel required>用户名</FormLabel>
                    <Input 
                      placeholder="请输入用户名" 
                      leftIcon={
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      }
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel required>邮箱</FormLabel>
                    <Input 
                      type="email" 
                      placeholder="请输入邮箱"
                      variant="filled"
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>个人简介</FormLabel>
                    <Textarea 
                      placeholder="请介绍一下自己..." 
                      rows={4}
                    />
                  </FormField>
                  
                  <Flex gap="md">
                    <Button type="submit" fullWidth>提交</Button>
                    <Button variant="outline" type="button" fullWidth>重置</Button>
                  </Flex>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>搜索组件</CardTitle>
                <CardDescription>带搜索功能的输入框</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchInput
                  placeholder="搜索内容..."
                  onSearch={(value) => alert(`搜索: ${value}`)}
                  onClear={() => alert('清空搜索')}
                />
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">输入状态演示</h4>
                  <Stack spacing="sm">
                    <Input 
                      placeholder="正常状态" 
                      helperText="这是帮助文本"
                    />
                    <Input 
                      placeholder="错误状态" 
                      error 
                      helperText="这是错误信息"
                    />
                    <Input 
                      placeholder="禁用状态" 
                      disabled 
                    />
                  </Stack>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* 模态框组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">模态框组件</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>模态框演示</CardTitle>
              <CardDescription>不同类型的模态框组件</CardDescription>
            </CardHeader>
            <CardContent>
              <Flex gap="md" wrap="wrap">
                <Button onClick={() => setShowModal(true)}>基础模态框</Button>
                <Button onClick={() => setShowConfirmModal(true)} variant="outline">
                  确认对话框
                </Button>
                <Button onClick={() => setShowAlertModal(true)} variant="secondary">
                  提示对话框
                </Button>
              </Flex>
            </CardContent>
          </Card>

          {/* 模态框组件 */}
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <ModalHeader title="基础模态框" subtitle="这是一个基础的模态框示例" />
            <ModalContent>
              <p className="mb-4">
                这是模态框的内容区域。你可以在这里放置任何内容，包括表单、列表、图片等。
              </p>
              <p>
                模态框支持多种尺寸，可以通过 ESC 键关闭，也可以点击背景遮罩关闭。
              </p>
            </ModalContent>
            <ModalFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button onClick={() => setShowModal(false)}>
                确认
              </Button>
            </ModalFooter>
          </Modal>

          <ConfirmModal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={() => {
              alert('确认操作');
              setShowConfirmModal(false);
            }}
            title="确认删除"
            message="确定要删除这个项目吗？此操作不可撤销。"
            confirmText="删除"
            cancelText="取消"
            variant="destructive"
          />

          <AlertModal
            open={showAlertModal}
            onClose={() => setShowAlertModal(false)}
            title="操作成功"
            message="您的操作已经成功完成！"
            variant="success"
          />
        </section>

        {/* 布局组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">布局组件</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>网格布局</CardTitle>
              <CardDescription>响应式网格系统展示</CardDescription>
            </CardHeader>
            <CardContent>
              <Grid cols={1} gap="md" responsive={{ sm: 2, md: 3, lg: 4 }}>
                {Array.from({ length: 8 }, (_, i) => (
                  <Card key={i} variant="outlined" className="p-4 text-center">
                    <div className="text-sm text-neutral-600">网格项 {i + 1}</div>
                  </Card>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Flex 布局</CardTitle>
              <CardDescription>灵活的弹性布局</CardDescription>
            </CardHeader>
            <CardContent>
              <Flex justify="between" align="center" className="p-4 bg-neutral-50 rounded-lg mb-4">
                <div className="text-sm font-medium">左侧内容</div>
                <div className="text-sm">中间内容</div>
                <Button size="sm">右侧按钮</Button>
              </Flex>
              
              <Stack spacing="sm" className="p-4 bg-neutral-50 rounded-lg">
                <div className="text-sm font-medium">垂直堆栈布局</div>
                <div className="text-sm text-neutral-600">项目 1</div>
                <div className="text-sm text-neutral-600">项目 2</div>
                <div className="text-sm text-neutral-600">项目 3</div>
              </Stack>
            </CardContent>
          </Card>
        </section>

        {/* 空状态组件 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">空状态组件</h2>
          
          <Card>
            <CardContent padding="none">
              <EmptyState
                title="暂无数据"
                description="目前还没有任何内容，点击下方按钮开始创建吧！"
                icon={
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="1" r="1" />
                    <circle cx="12" cy="23" r="1" />
                    <circle cx="20.49" cy="8.51" r="1" />
                    <circle cx="3.51" cy="15.49" r="1" />
                    <circle cx="20.49" cy="15.49" r="1" />
                    <circle cx="3.51" cy="8.51" r="1" />
                  </svg>
                }
                action={<Button>开始创建</Button>}
              />
            </CardContent>
          </Card>
        </section>
      </Stack>
    </Container>
  );
}