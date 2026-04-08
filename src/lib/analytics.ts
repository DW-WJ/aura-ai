'use client';

// Simple analytics wrapper — uses Vercel Analytics track when available
// Falls back to console.log in dev

type EventProps = Record<string, string | number | boolean>;

function trackInternal(eventName: string, props?: EventProps) {
  // Vercel Analytics auto-tracks page views
  // For custom events, use window.va if available (Vercel Analytics v2)
  const va = (window as Window & { va?: { track: (name: string, props?: EventProps) => void } }).va;
  if (va) {
    va.track(eventName, props);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, props);
  }
}

export const analytics = {
  quizStarted(lang: string) {
    trackInternal('quiz_started', { lang });
  },

  quizCompleted(lang: string, durationMs: number) {
    trackInternal('quiz_completed', { lang, duration_ms: durationMs });
  },

  aiEnhanceStarted() {
    trackInternal('ai_enhance_started');
  },

  aiEnhanceCompleted(model: string, success: boolean) {
    trackInternal('ai_enhance_completed', { model, success });
  },

  aiEnhanceFailed(errorCode: string) {
    trackInternal('ai_enhance_failed', { error_code: errorCode });
  },

  configCopied() {
    trackInternal('config_copied');
  },

  configDownloaded() {
    trackInternal('config_downloaded');
  },

  quizRestarted() {
    trackInternal('quiz_restarted');
  },

  pageView(path: string) {
    trackInternal('page_view', { path });
  },
};
