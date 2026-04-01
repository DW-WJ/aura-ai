import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA · 打造你的专属 AI 助手 | AI 人格配置器",
  description: "通过 16 个精准问题，为你生成专属的 AI 助手配置。深度人格分析、高质量系统提示词、多维能力评估。",
  keywords: ["AI 助手", "AI 配置", "人格测试", "AI 人格", "系统提示词", "AI 伙伴"],
  authors: [{ name: "AURA Team" }],
  creator: "AURA",
  publisher: "AURA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://aura-app-ten-weld.vercel.app",
    siteName: "AURA",
    title: "AURA · 打造你的专属 AI 助手",
    description: "通过 16 个精准问题，为你生成专属的 AI 助手配置。深度人格分析、高质量系统提示词、多维能力评估。",
    images: [
      {
        url: "https://aura-app-ten-weld.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AURA - AI 人格配置器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA · 打造你的专属 AI 助手",
    description: "通过 16 个精准问题，为你生成专属的 AI 助手配置。",
    images: ["https://aura-app-ten-weld.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://aura-app-ten-weld.vercel.app",
  },
};

function NavBar() {
  const links = [
    { href: "/", label: "工具" },
    { href: "/features", label: "功能" },
    { href: "/use-cases", label: "场景" },
    { href: "/about", label: "关于" },
    { href: "/pricing", label: "价格" },
    { href: "/blog", label: "博客" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "联系" },
  ];

  return (
    <nav className="top-nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">A</div>
          <span>AURA</span>
        </Link>
        
        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="nav-cta">
          开始测评
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080810" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://aura-app-ten-weld.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AURA",
              description: "AI 人格配置器",
              url: "https://aura-app-ten-weld.vercel.app",
              applicationCategory: "Productivity",
              offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "100" },
            }),
          }}
        />
      </head>
      <body>
        <NavBar />
        <div style={{ paddingTop: 64 }}>
          {children}
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
