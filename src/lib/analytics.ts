'use client';

// 浏览器指纹生成（简化版）
function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || '',
  ];
  return components.join('|').slice(0, 64);
}

// 生成会话 ID
function generateSessionId(): string {
  return 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// 获取或创建会话 ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const storageKey = 'aura_session';
  const sessionTimeout = 30 * 60 * 1000; // 30 分钟

  const existing = sessionStorage.getItem(storageKey);
  if (existing) {
    const data = JSON.parse(existing);
    if (Date.now() - data.lastActive < sessionTimeout) {
      data.lastActive = Date.now();
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      return data.id;
    }
  }

  const newSession = {
    id: generateSessionId(),
    startTime: Date.now(),
    lastActive: Date.now(),
    pageCount: 0,
  };
  sessionStorage.setItem(storageKey, JSON.stringify(newSession));
  return newSession.id;
}

// 发送追踪数据
async function trackEvent(type: string, data: Record<string, unknown>) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
  } catch (e) {
    console.debug('[Analytics] Track failed:', type);
  }
}

// 公开 API
export const analytics = {
  // ========== 页面访问追踪 ==========

  trackPageView(path: string, userId?: string) {
    const sessionId = getSessionId();
    const fingerprint = generateFingerprint();

    trackEvent('pageview', {
      fingerprint,
      path,
      referrer: document.referrer.slice(0, 255),
      userId,
    });

    // 更新会话
    const sessionData = sessionStorage.getItem('aura_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.pageCount = (session.pageCount || 0) + 1;
      sessionStorage.setItem('aura_session', JSON.stringify(session));

      trackEvent('session_update', {
        sessionId,
        lastPath: path,
        pageCount: session.pageCount,
        duration: Math.floor((Date.now() - session.startTime) / 1000),
      });
    }

    return sessionId;
  },

  // ========== 会话追踪 ==========

  startSession(firstPath: string, userId?: string) {
    const sessionId = getSessionId();
    const fingerprint = generateFingerprint();

    trackEvent('session_start', {
      sessionId,
      fingerprint,
      firstPath,
      userId,
    });

    return sessionId;
  },

  // ========== 测评相关 ==========

  // 别名：兼容旧代码
  quizStarted(_lang?: string) {
    this.trackQuizStart();
  },

  trackQuizStart() {
    trackEvent('quiz_start', {});
  },

  // 别名：兼容旧代码
  quizCompleted(_lang?: string, _duration?: number) {
    this.trackQuizComplete();
  },

  trackQuizComplete() {
    const sessionData = sessionStorage.getItem('aura_session');
    const sessionId = sessionData ? JSON.parse(sessionData).id : null;

    trackEvent('quiz_complete', { sessionId });
  },

  // ========== AI 增强 ==========

  aiEnhanceStarted() {
    // 内部追踪，在完成/失败时上报
  },

  aiEnhanceCompleted(model: string, _success: boolean, duration?: number) {
    const fingerprint = generateFingerprint();

    trackEvent('ai_enhance', {
      fingerprint,
      model,
      duration: duration || 0,
      status: 200,
    });
  },

  aiEnhanceFailed(errorMsg: string, model?: string) {
    const fingerprint = generateFingerprint();

    trackEvent('ai_enhance', {
      fingerprint,
      model: model || '',
      status: 500,
      errorMsg,
    });
  },

  trackAiEnhance(model: string, duration: number, status: number, errorMsg?: string, userId?: string) {
    const fingerprint = generateFingerprint();

    trackEvent('ai_enhance', {
      userId,
      fingerprint,
      model,
      duration,
      status,
      errorMsg,
    });
  },

  // ========== 配置操作 ==========

  configCopied() {
    trackEvent('config_copy', {});
  },

  configDownloaded() {
    trackEvent('config_download', {});
  },

  // ========== 工具方法 ==========

  getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    const sessionData = sessionStorage.getItem('aura_session');
    return sessionData ? JSON.parse(sessionData).id : null;
  },

  getFingerprint(): string {
    return generateFingerprint();
  },
};

export default analytics;
