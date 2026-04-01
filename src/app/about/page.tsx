'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            关于 AURA
          </h1>
          <p className="text-lg text-[#9090b0] leading-relaxed">
            我们相信，每个人都应该拥有一个真正懂自己的 AI 伙伴。
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[720px] mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">我们的故事</h2>
            <p className="text-[#9090b0] leading-relaxed mb-4">
              AURA 诞生于一个简单的观察：人们使用 AI 的方式千差万别。有人需要直接坦诚的反馈，有人需要温暖共情的陪伴。有人想要快速的答案，有人想要深度的分析。
            </p>
            <p className="text-[#9090b0] leading-relaxed mb-4">
              但大多数 AI 工具都是一刀切的。它们对所有人都表现得一样，无法适应个人的独特需求。
            </p>
            <p className="text-[#9090b0] leading-relaxed">
              所以我们创建了 AURA——一个帮助你定义理想 AI 伙伴的工具。通过 16 个精准问题，我们为你生成一份专属的 AI 配置，让 AI 真正懂你。
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">我们的使命</h2>
            <p className="text-[#9090b0] leading-relaxed">
              让每个人都能拥有一个完全个性化的 AI 助手，提升工作效率、激发创意、支持成长。
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">核心价值观</h2>
            <ul className="space-y-3">
              {[
                { title: '个性化', desc: '没有一刀切的解决方案，每个人都独一无二' },
                { title: '透明', desc: '开源代码，数据在你手里，完全可控' },
                { title: '易用', desc: '5 分钟完成配置，无需技术背景' },
                { title: '免费', desc: '永远免费，没有隐藏费用' },
              ].map((v) => (
                <li key={v.title} className="flex gap-4">
                  <span className="text-[#8b5cf6] font-bold flex-shrink-0">✦</span>
                  <div>
                    <div className="font-semibold text-white">{v.title}</div>
                    <div className="text-[#9090b0] text-sm">{v.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">开源社区</h2>
            <p className="text-[#9090b0] leading-relaxed mb-4">
              AURA 是完全开源的项目。我们相信开放和透明能创造更好的产品。
            </p>
            <a
              href="https://github.com/DW-WJ/aura-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              在 GitHub 查看代码
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
