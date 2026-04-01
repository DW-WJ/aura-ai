'use client';

export default function UseCases() {
  const cases = [
    {
      title: '内容创作者',
      desc: '需要一个能理解创意思维、提供灵感的 AI 伙伴',
      example: '博主、作家、设计师',
    },
    {
      title: '程序员',
      desc: '需要一个能快速解决问题、给出代码建议的 AI',
      example: '全栈开发、数据科学家、DevOps',
    },
    {
      title: '企业管理者',
      desc: '需要一个能帮助决策、分析数据的 AI 顾问',
      example: 'CEO、产品经理、运营负责人',
    },
    {
      title: '学生',
      desc: '需要一个能耐心讲解、帮助学习的 AI 导师',
      example: '高中生、大学生、在线学习者',
    },
    {
      title: '自由职业者',
      desc: '需要一个能提升效率、管理项目的 AI 助手',
      example: '自由撰稿人、顾问、承包商',
    },
    {
      title: '创业者',
      desc: '需要一个能头脑风暴、验证想法的 AI 合伙人',
      example: '初创公司创始人、产品开发者',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            使用场景
          </h1>
          <p className="text-lg text-[#9090b0]">
            AURA 适合所有想要一个真正懂自己的 AI 伙伴的人
          </p>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="px-4 py-16">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div
              key={c.title}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#8b5cf6]">
                {c.title}
              </h3>
              <p className="text-[#9090b0] mb-4">{c.desc}</p>
              <p className="text-sm text-[#6b6b8a]">
                例如：{c.example}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">为什么选择 AURA</h2>
          
          <div className="space-y-6">
            {[
              {
                title: '节省时间',
                desc: '不用反复调试 Prompt，直接获得优化好的系统提示词',
              },
              {
                title: '提升效率',
                desc: 'AI 更懂你的需求，回答质量更高，工作效率提升 30%+',
              },
              {
                title: '改善体验',
                desc: '从"我在用 AI"变成"AI 在帮我"，工作变得更轻松',
              },
              {
                title: '持续优化',
                desc: '可以随时调整配置，让 AI 更好地适应你的变化',
              },
            ].map((b) => (
              <div key={b.title} className="flex gap-4">
                <span className="text-[#8b5cf6] text-2xl flex-shrink-0">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-[#9090b0]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">准备好了吗？</h2>
        <p className="text-[#9090b0] mb-8 max-w-[500px] mx-auto">
          5 分钟完成测评，获得你的专属 AI 配置
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all"
        >
          开始配置 →
        </a>
      </div>
    </div>
  );
}
