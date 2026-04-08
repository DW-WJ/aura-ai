'use client';

import { useEffect, useCallback } from 'react';

interface UseQuizKeyboardOptions {
  optionCount: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  onPrev: () => void;
  enabled?: boolean;
}

/**
 * Keyboard navigation for quiz:
 * - Arrow Up / Arrow Left  → previous option
 * - Arrow Down / Arrow Right → next option
 * - Enter / Space → confirm & next
 * - Backspace → previous question
 * - R → random (fill all)
 */
export function useQuizKeyboard({
  optionCount,
  selectedIndex,
  onSelect,
  onConfirm,
  onPrev,
  enabled = true,
}: UseQuizKeyboardOptions) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        if (optionCount > 0) {
          onSelect((selectedIndex ?? -1 + 1) % optionCount);
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        if (optionCount > 0) {
          onSelect((selectedIndex ?? 0 - 1 + optionCount) % optionCount);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex !== null) {
          onConfirm();
        }
        break;
      case 'Backspace':
        e.preventDefault();
        onPrev();
        break;
    }
  }, [enabled, optionCount, selectedIndex, onSelect, onConfirm, onPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
}
