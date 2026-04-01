'use client';

import { useEffect, useState } from 'react';
import { PersonalityStats, Lang } from '@/types';

interface Props {
  stats: PersonalityStats;
  lang: Lang;
}

const STAT_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#ec4899'];

export default function StatsBars({ stats, lang }: Props) {
  const [widths, setWidths] = useState({ initiative: 0, clarity: 0, honesty: 0, execution: 0, empathy: 0 });

  const labels = lang === 'zh'
    ? { initiative: '主动性', clarity: '清晰度', honesty: '诚实度', execution: '执行力', empathy: '共情力' }
    : { initiative: 'Initiative', clarity: 'Clarity', honesty: 'Honesty', execution: 'Execution', empathy: 'Empathy' };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidths({
        initiative: stats.initiative,
        clarity: stats.clarity,
        honesty: stats.honesty,
        execution: stats.execution,
        empathy: stats.empathy,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [stats]);

  return (
    <div className="flex flex-col gap-3">
      {(Object.keys(stats) as Array<keyof PersonalityStats>).map((key, i) => (
        <div key={key} className="flex items-center gap-3">
          <div className="text-[0.78rem] text-[#9090b0] w-[56px] flex-shrink-0">{labels[key]}</div>
          <div className="flex-1 h-[5px] bg-[#13131f] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${widths[key]}%`,
                background: STAT_COLORS[i],
              }}
            />
          </div>
          <div className="text-[0.78rem] text-[#6b6b8a] w-[30px] text-right flex-shrink-0">{stats[key]}</div>
        </div>
      ))}
    </div>
  );
}
