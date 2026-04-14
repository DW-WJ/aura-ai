'use client';

interface Props {
  current: number;
  total: number;
  accentColor?: string;
}

export default function ProgressBar({ current, total, accentColor = '#8b5cf6' }: Props) {
  const progress = Math.round((current / total) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`第 ${current} 题，共 ${total} 题`}
      className="fixed top-0 left-0 right-0 h-[3px] bg-white/[0.05] z-40"
    >
      <div
        className="h-full transition-all duration-400 ease-out"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
          boxShadow: `0 0 12px ${accentColor}60`,
        }}
      />
    </div>
  );
}
