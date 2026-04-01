'use client';

import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            联系我们
          </h1>
          <p className="text-lg text-[#9090b0]">
            有问题、建议或想要合作？我们很乐意听到你的声音。
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="px-4 py-16">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: '💬',
              title: 'GitHub Issues',
              desc: '报告 bug 或提出功能建议',
              link: 'https://github.com/DW-WJ/aura-ai/issues',
            },
            {
              icon: '📧',
              title: '邮件',
              desc: '发送邮件给我们',
              link: 'mailto:contact@aura-ai.com',
            },
            {
              icon: '🐦',
              title: '社交媒体',
              desc: '在 Twitter 上关注我们',
              link: 'https://twitter.com/aura_ai',
            },
          ].map((method) => (
            <a
              key={method.title}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 hover:border-[rgba(139,92,246,0.3)] transition-all text-center"
            >
              <div className="text-4xl mb-3">{method.icon}</div>
              <h3 className="font-semibold mb-2">{method.title}</h3>
              <p className="text-[#9090b0] text-sm">{method.desc}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-[500px] mx-auto bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">发送消息</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">名字</label>
              <input
                type="text"
                required
                className="w-full bg-[#080810] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-[#6b6b8a] focus:outline-none focus:border-[#8b5cf6]"
                placeholder="你的名字"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">邮箱</label>
              <input
                type="email"
                required
                className="w-full bg-[#080810] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-[#6b6b8a] focus:outline-none focus:border-[#8b5cf6]"
                placeholder="你的邮箱"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <input
                type="text"
                required
                className="w-full bg-[#080810] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-[#6b6b8a] focus:outline-none focus:border-[#8b5cf6]"
                placeholder="消息主题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">消息</label>
              <textarea
                required
                rows={5}
                className="w-full bg-[#080810] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-[#6b6b8a] focus:outline-none focus:border-[#8b5cf6] resize-none"
                placeholder="你的消息..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {submitted ? '✓ 已发送' : '发送消息'}
            </button>
          </form>

          {submitted && (
            <div className="mt-4 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg text-[#10b981] text-sm text-center">
              感谢你的消息！我们会尽快回复。
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">常见问题</h2>
          
          <div className="space-y-4">
            {[
              {
                q: '多久能收到回复？',
                a: '我们通常在 24 小时内回复。对于紧急问题，请在 GitHub 上提 issue。',
              },
              {
                q: '我可以为 AURA 做贡献吗？',
                a: '当然可以！AURA 是开源的。欢迎提交 PR 或报告 bug。',
              },
              {
                q: '我想赞助 AURA',
                a: '感谢你的支持！目前我们不接受赞助，但你可以通过分享 AURA 来帮助我们。',
              },
            ].map((item) => (
              <div key={item.q} className="border-l-2 border-[#8b5cf6] pl-6">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-[#9090b0]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
