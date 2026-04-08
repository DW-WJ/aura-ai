'use client';

import { useEffect } from 'react';

export default function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          // Registered successfully
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
