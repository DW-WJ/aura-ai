"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import analytics from '@/lib/analytics';

interface PageTrackerProps {
  quizType?: 'aura' | 'nbti' | 'sbti';
  onQuizStart?: () => void;
  onQuizComplete?: () => void;
}

export default function PageTracker({ quizType, onQuizStart, onQuizComplete }: PageTrackerProps) {
  const pathname = usePathname();
  const hasTracked = useRef(false);
  const quizStarted = useRef(false);

  // 页面访问追踪（每次路由变化）
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const sessionId = analytics.trackPageView(pathname);

    const isQuizPage = pathname.includes('nbti') || pathname.includes('sbti') || pathname === '/';
    if (isQuizPage && !quizStarted.current) {
      quizStarted.current = true;
      analytics.trackQuizStart();
      onQuizStart?.();
    }
  }, [pathname, onQuizStart]);

  // 测评完成事件
  useEffect(() => {
    if (onQuizComplete) {
      analytics.trackQuizComplete();
      onQuizComplete();
    }
  }, [onQuizComplete]);

  // AI 增强追踪（全局挂载）
  useEffect(() => {
    (window as any).__analyticsTrackAi = (model: string, duration: number, success: boolean) => {
      if (success) {
        analytics.aiEnhanceCompleted(model, true, duration);
      } else {
        analytics.aiEnhanceFailed(model, model);
      }
    };
  }, []);

  return null;
}

// 便捷函数：直接追踪 AI 增强
export function trackAiEnhance(model: string, duration: number, success: boolean) {
  if (success) {
    analytics.aiEnhanceCompleted(model, true, duration);
  } else {
    analytics.aiEnhanceFailed(model, model);
  }
}
