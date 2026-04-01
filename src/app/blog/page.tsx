'use client';

export default function Blog() {
  const posts = [
    {
      title: '如何选择适合你的 AI 助手',
      excerpt: '不同的人对 AI 的需求完全不同。了解你的需求是选择正确 AI 的第一步。',
      date: '2026-04-01',
      readTime: '5 分钟',
    },
    {
      title: 'AI 人格配置的 5 个关键维度',
      excerpt: '从沟通风格到工作方式，这 5 个维度决定了你的 AI 伙伴如何与你互动。',
      date: '2026-03-28',
      readTime: '8 分钟',
    },
    {
      title: '为什么你的 AI 不懂你',
      excerpt: '大多数 AI 工具都是一刀切的。了解为什么个性化配置如此重要。',
      date: '2026-03-25',
      readTime: '6 分钟',
    },
    {
      title: '系统提示词完全指南',
      excerpt: '什么是系统提示词？为什么它对 AI 的表现如此关键？',
      date: '2026-03-22',
      readTime: '10 分钟',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Hero */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AURA 博客
          </h1>
          <p className="text-lg text-[#9090b0]">
            关于 AI、人格配置和工作效率的深度思考
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-16">
        <div className="max-w-[720px] mx-auto space-y-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 hover:border-[rgba(139,92,246,0.3)] transition-all cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-3 hover:text-[#8b5cf6] transition-colors">
                {post.title}
              </h2>
              <p className="text-[#9090b0] mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-[#6b6b8a]">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="px-4 py-16 bg-[#0e0e1a]">
        <div className="max-w-[500px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">订阅我们的通讯</h2>
          <p className="text-[#9090b0] mb-6">
            每周获取关于 AI 和生产力的最新文章
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="你的邮箱"
              className="flex-1 bg-[#080810] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-[#6b6b8a] focus:outline-none focus:border-[#8b5cf6]"
            />
            <button className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              订阅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
