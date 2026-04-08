'use client';

// Analytics wrapper — safe to call anywhere, no-op if analytics unavailable

type EventProps = Record<string, string | number | boolean>;

function track(eventName: string, props?: EventProps) {
  try {
    // Vercel Analytics v2: window.va?.('event', { name, ... })
    const va = (window as Window & {
      va?: (...args: unknown[]) => void
    }).va;
    if (typeof va === 'function') {
      va('event', { name: eventName, ...props });
    }
  } catch {
    // Silently ignore — analytics must never break the app
  }
}

export const analytics = {
  quizStarted(lang: string) {
    track('quiz_started', { lang });
  },

  quizCompleted(lang: string, durationMs: number) {
    track('quiz_completed', { lang, duration_ms: durationMs });
  },

  aiEnhanceStarted() {
    track('ai_enhance_started');
  },

  aiEnhanceCompleted(model: string, success: boolean) {
    track('ai_enhance_completed', { model, success });
  },

  aiEnhanceFailed(errorCode: string) {
    track('ai_enhance_failed', { error_code: errorCode });
  },

  configCopied() {
    track('config_copied');
  },

  configDownloaded() {
    track('config_downloaded');
  },

  quizRestarted() {
    track('quiz_restarted');
  },

  pageView(path: string) {
    track('page_view', { path });
  },
};
