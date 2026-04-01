import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA · 打造你的专属 AI",
  description: "回答 16 个问题，生成你的专属 AI 助手配置",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
