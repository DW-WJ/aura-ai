'use client';

interface Props {
  value: number; // 0-100
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] transition-all duration-500 ease-out"
      style={{
        width: `${value}%`,
        background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
        boxShadow: '0 0 16px rgba(139,92,246,0.8)',
      }}
    />
  );
}
