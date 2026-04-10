import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AURA Admin · 管理后台",
  description: "AURA 管理后台 - 访问统计与数据分析",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 路由组 layout 只返回 children，不包含 html/body
  // CSS 隐藏导航栏在 admin/page.tsx 中处理
  return children;
}