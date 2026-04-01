import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    url: "https://aura-ai.vercel.app",
    siteName: "AURA",
    title: "AURA · 打造你的专属 AI 助手",
    description: "通过 16 个精准问题，为你生成专属的 AI 助手配置。深度人格分析、高质量系统提示词、多维能力评估。",
    images: [
      {
        url: "https://aura-ai.vercel.app/og-image.png",
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
    images: ["https://aura-ai.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://aura-ai.vercel.app",
  },
};

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
        <link rel="canonical" href="https://aura-ai.vercel.app" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AURA",
              description: "AI 人格配置器 - 为你生成专属的 AI 助手配置",
              url: "https://aura-ai.vercel.app",
              applicationCategory: "Productivity",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "100",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

