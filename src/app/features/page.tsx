'use client';

export default function Features() {
  const features = [
    {
      icon: '📋',
      title: '16 题精准测评',
      desc: '覆盖 8 个人格维度，深度分析你的需求和偏好',
    },
    {
      icon: '🧠',
      title: '多维人格分析',
      desc: '5 轴能力评估、雷达图、详细的性格特征分解',
    },
    {
      icon: '✨',
      title: '高质量配置导出',
      desc: '专业的系统提示词，包含角色定义、沟通准则、工作方式',
    },
    {
      icon: '🎨',
      title: '精美的用户界面',
      desc: '深色主题、流畅动画、完全响应式设计',
    },
    {
      icon: '🌍',
      title: '多语言支持',
      desc: '中文和英文，一键切换',
    },
    {
      icon: '🚀',
      title: '完全免费',
      desc: '永远免费，没有隐藏费用或付费功能',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            功能特性
          </h1>
          <p className="text-lg text-[#9090b0]">
            AURA 提供的一切，都是为了帮你找到完美的 AI 伙伴
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 py-16">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 hover:border-[rgba(139,92,246,0.3)] transition-all"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-[#9090b0]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">工作流程</h2>
          
          <div className="space-y-8">
            {[
              { num: '1', title: '回答问卷', desc: '16 个精心设计的问题，了解你的需求' },
              { num: '2', title: 'AI 分析', desc: '系统分析你的答案，计算人格维度' },
              { num: '3', title: '生成配置', desc: '为你生成专属的 AI 配置和系统提示词' },
              { num: '4', title: '使用配置', desc: '复制配置到任何 AI 工具，开始使用' },
            ].map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">
                    {step.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-[#9090b0]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
