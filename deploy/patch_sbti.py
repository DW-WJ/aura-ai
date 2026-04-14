#!/usr/bin/env python3
import re

path = '/www/wwwroot/aura-app/src/components/pages/SBTIQuiz.tsx'

with open(path, 'r') as f:
    content = f.read()

# 1. Add useCallback import
content = content.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect, useCallback, useRef } from 'react';"
)

# 2. Add state for direction
content = content.replace(
    "const [started, setStarted] = useState(false);",
    "const [started, setStarted] = useState(false);\n  const [direction, setDirection] = useState<'forward' | 'back'>('forward');\n  const questionRef = useRef(null);"
)

# 3. Add keyboard navigation effect (after the Fisher-Yates shuffle effect)
keyboard_code = '''
  // Keyboard navigation
  useEffect(() => {
    if (!started || currentQ >= questions.length) return;
    const handler = (e: KeyboardEvent) => {
      const q = questions[currentQ];
      const optCount = q ? q.options.length : 0;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setSelected(s => s === null ? 0 : Math.min(s + 1, optCount - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setSelected(s => s === null ? 0 : Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && selected !== null) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault();
        if (currentQ > 0) {
          setDirection('back');
          setAnimating(true);
          setTimeout(() => {
            setCurrentQ(c => c - 1);
            setAnswers(a => a.slice(0, -1));
            setSelected(null);
            setAnimating(false);
          }, 200);
        } else {
          setStarted(false);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [started, currentQ, selected, questions]);

'''

# Insert after the Fisher-Yates shuffle effect
marker = "  const questions = shuffledQuestions;"
idx = content.find(marker)
if idx > 0:
    content = content[:idx] + keyboard_code + content[idx:]

# 3. Update handleNext to set direction
content = content.replace(
    "    const newAnswers = [...answers, selected];\n    setAnswers(newAnswers);\n    setAnimating(true);",
    "    const newAnswers = [...answers, selected];\n    setAnswers(newAnswers);\n    setDirection('forward');\n    setAnimating(true);"
)

with open(path, 'w') as f:
    f.write(content)

print('Done')
