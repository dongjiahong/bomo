export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
          {/* Logo 区域 */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">B</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">欢迎来到 BOMO</h1>
            <p className="text-xl text-gray-600">你的第二个大脑 · 个人知识管理系统</p>
          </div>

          {/* 功能特色 */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">智能知识整合</h3>
              <p className="text-gray-600">统一管理读书笔记、思维导图和日常感悟</p>
            </div>
            <div className="p-6 bg-amber-50 rounded-xl">
              <div className="w-12 h-12 bg-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">目标规划</h3>
              <p className="text-gray-600">通过 OKR 系统规划人生，追踪成长轨迹</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">智能检索</h3>
              <p className="text-gray-600">快速找到需要的知识，随时获取过往智慧</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">持续成长</h3>
              <p className="text-gray-600">通过回顾和反思，促进个人发展</p>
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="space-y-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105">
              开始构建第二个大脑
            </button>
            <p className="text-sm text-gray-500">项目正在开发中，敬请期待完整功能 ✨</p>
          </div>
        </div>
      </div>
    </main>
  )
}
