'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-white text-xl font-semibold mb-2">页面出了点问题</h1>
          <p className="text-[#6b6b8a] text-sm mb-6 max-w-[360px]">
            {this.state.error?.message ?? '发生了未知错误'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition-all"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
