'use client';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            简单透明的价格
          </h1>
          <p className="text-lg text-[#9090b0]">
            AURA 永远免费。没有隐藏费用，没有付费功能。
          </p>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="px-4 py-16">
        <div className="max-w-[500px] mx-auto">
          <div className="bg-gradient-to-b from-[#0e0e1a] to-[#0a0a12] border border-[#8b5cf6]/30 rounded-3xl p-8 text-center">
            <div className="text-6xl font-bold mb-2">¥0</div>
            <div className="text-[#9090b0] mb-8">永远免费</div>
            
            <ul className="space-y-4 mb-8 text-left">
              {[
                '16 题精准人格测评',
                '多维能力分析（5 轴）',
                '高质量系统提示词导出',
                '雷达图 + 能力条可视化',
                '中英文双语支持',
                '无限次数使用',
                '无广告',
                '无数据收集',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-[#10b981]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/"
              className="block w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              开始使用
            </a>
          </div>
        </div>
      </div>

      {/* Why Free */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">为什么永远免费？</h2>
          
          <div className="space-y-6">
            {[
              {
                title: '开源精神',
                desc: '我们相信好的工具应该对所有人开放。AURA 是完全开源的。',
              },
              {
                title: '用户至上',
                desc: '我们的目标是帮助人们找到完美的 AI 伙伴，而不是赚钱。',
              },
              {
                title: '长期价值',
                desc: '通过免费提供价值，我们建立信任和社区。这比任何付费模式都更有价值。',
              },
              {
                title: '可持续性',
                desc: '通过 Vercel 的免费额度和开源社区支持，我们可以长期维持免费服务。',
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-[#8b5cf6] pl-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-[#9090b0]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Plans */}
      <div className="px-4 py-16">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">未来计划</h2>
          <p className="text-[#9090b0] mb-8">
            我们正在开发一些高级功能，但核心功能将永远保持免费。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '用户账号系统',
              '配置历史保存',
              '配置分享和协作',
              '高级分析报告',
            ].map((feature) => (
              <div
                key={feature}
                className="bg-[#0e0e1a] border border-white/[0.06] rounded-xl p-4"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
