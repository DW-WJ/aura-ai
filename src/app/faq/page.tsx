'use client';

export default function FAQ() {
  const faqs = [
    {
      q: "AURA 是什么？",
      a: "AURA 是一个 AI 人格配置器。通过 16 个精准问题，为你生成专属的 AI 助手配置。包含详细的系统提示词、人格分析、能力评估等。",
    },
    {
      q: "为什么需要 AI 人格配置？",
      a: "不同的人对 AI 的需求不同。有人需要直接坦诚的反馈，有人需要温暖共情的陪伴。AURA 帮你定义理想的 AI 伙伴，让 AI 真正懂你。",
    },
    {
      q: "16 个问题需要多长时间？",
      a: "通常 5-10 分钟。如果你赶时间，可以点击「随机」按钮快速跳过。",
    },
    {
      q: "生成的配置可以用在哪里？",
      a: "配置文件是标准的 Markdown 格式，可以用在任何支持自定义系统提示词的 AI 工具上，比如 ChatGPT、Claude、Gemini 等。",
    },
    {
      q: "我的数据会被保存吗？",
      a: "目前配置只保存在你的浏览器本地。我们正在开发用户系统，让你可以保存和管理多个配置。",
    },
    {
      q: "可以修改生成的配置吗？",
      a: "完全可以！生成的配置是 Markdown 文件，你可以随意编辑和调整。",
    },
    {
      q: "AURA 支持哪些语言？",
      a: "目前支持中文和英文。右上角可以切换语言。",
    },
    {
      q: "这个工具免费吗？",
      a: "完全免费！AURA 是开源项目，没有任何付费功能。",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8] px-4 py-20">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">常见问题</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                {faq.q}
              </h3>
              <p className="text-[#9090b0] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#6b6b8a]">
            还有其他问题？{' '}
            <a
              href="https://github.com/DW-WJ/aura-ai/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
            >
              在 GitHub 提问
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
