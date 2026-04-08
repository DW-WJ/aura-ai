import { Answers, BuildResult, PersonalityStats, Lang } from '@/types';
import { namePool } from '@/data/questions';
import {
  DIMENSIONS,
  MEMORY_MAP,
  DOMAIN_MAP,
  BOUNDARY_MAP,
  DEPTH_MAP,
  GROWTH_MAP,
  CREATIVITY_MAP,
  STAT_LABELS,
  DimConfig,
} from '@/data/dimensions';

export { DIMENSIONS, MEMORY_MAP, DOMAIN_MAP, BOUNDARY_MAP, DEPTH_MAP, GROWTH_MAP, CREATIVITY_MAP, STAT_LABELS };
export type { DimConfig };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number): number {
  return Math.max(10, Math.min(100, v));
}

function makeStats(boosts: Partial<PersonalityStats>[]): PersonalityStats {
  const result: PersonalityStats = { initiative: 50, clarity: 50, honesty: 50, execution: 50, empathy: 50 };
  for (const b of boosts) {
    for (const k of Object.keys(b) as Array<keyof PersonalityStats>) {
      result[k] = clamp(result[k] + (b[k] ?? 0));
    }
  }
  return result;
}

function getOrDefault<T>(map: Record<string, T>, key: string, fallback: T): T {
  return map[key] ?? fallback;
}

// ─── Core Build Logic ────────────────────────────────────────────────────────

export function buildResult(answers: Answers, lang: Lang): BuildResult {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // Resolve dimension configs
  const i = getOrDefault(DIMENSIONS.INTERACTION, answers.interaction, DIMENSIONS.INTERACTION.balanced);
  const s = getOrDefault(DIMENSIONS.STYLE, answers.style, DIMENSIONS.STYLE.casual);
  const f = getOrDefault(DIMENSIONS.FEEDBACK, answers.feedback, DIMENSIONS.FEEDBACK.gentle);
  const tk = getOrDefault(DIMENSIONS.TASK, answers.task, DIMENSIONS.TASK.options);
  const tn = getOrDefault(DIMENSIONS.TONE, answers.tone, DIMENSIONS.TONE.warm);
  const r = getOrDefault(DIMENSIONS.RELATION, answers.relation, DIMENSIONS.RELATION.companion);

  // Forbidden patterns
  const allForbidden: string[] = [
    ...i.forbidden_zh, ...s.forbidden_zh, ...f.forbidden_zh, ...tk.forbidden_zh, ...tn.forbidden_zh,
    ...i.forbidden_en, ...s.forbidden_en, ...f.forbidden_en, ...tk.forbidden_en, ...tn.forbidden_en,
  ];

  // Sub-dimensions
  const mem = getOrDefault(MEMORY_MAP, answers.memory, MEMORY_MAP.contextual);
  const dom = getOrDefault(DOMAIN_MAP, answers.domain, DOMAIN_MAP.productivity);
  const bnd = getOrDefault(BOUNDARY_MAP, answers.boundary, BOUNDARY_MAP.transparent);
  const dep = getOrDefault(DEPTH_MAP, answers.depth, DEPTH_MAP.balanced);
  const grw = getOrDefault(GROWTH_MAP, answers.growth, GROWTH_MAP.amplify);
  const crv = getOrDefault(CREATIVITY_MAP, answers.creativity, CREATIVITY_MAP.diverse);

  // Stats
  const stats = makeStats([i.statBoost, s.statBoost, f.statBoost, tk.statBoost, tn.statBoost, r.statBoost]);

  // Traits
  const traits = [
    t(i.label_zh, i.label_en),
    t(s.label_zh, s.label_en),
    t(f.label_zh, f.label_en),
    t(tk.label_zh, tk.label_en),
    t(tn.label_zh, tn.label_en),
  ];

  // Name
  const pool = namePool[answers.name_pref] || namePool.random;
  const name = pool[Math.floor(Math.random() * pool.length)];

  const typeName = t('专属人格型 AI', 'Personalized AI');

  const desc = t(
    `你是一个深度理解用户思维方式的 AI 伙伴，融合了${traits.join('、')}的特点。` +
    `你的使命是：理解用户代表什么，在每次互动中体现这种理解。`,
    `You are an AI deeply aligned with the user's thinking style, combining ${traits.join(', ')}. ` +
    `Your mission: understand what the user stands for and embody that understanding in every interaction.`
  );

  const commLines = [
    t(i.commDirective_zh, i.commDirective_en),
    t(s.commDirective_zh, s.commDirective_en),
    t(f.commDirective_zh, f.commDirective_en),
    t(tn.commDirective_zh, tn.commDirective_en),
  ];

  const workLines = [
    t(tk.workDirective_zh, tk.workDirective_en),
    t(dep.zh, dep.en),
    t(crv.zh, crv.en),
  ];

  const growLines = [t(grw.zh, grw.en)];

  const configText = generateConfig(
    name, typeName, desc, traits,
    commLines, workLines, growLines,
    dom[t('zh', 'en') as 'zh' | 'en'],
    mem[t('zh', 'en') as 'zh' | 'en'],
    bnd[t('zh', 'en') as 'zh' | 'en'],
    allForbidden.filter(f => lang === 'zh'),
    allForbidden.filter(f => lang === 'en'),
    stats,
    lang,
  );

  return { name, typeName, desc, traits, commLines, workLines, growLines, behaviorLines: commLines, stats, configText };
}

// ─── Config Text Generator ────────────────────────────────────────────────────

/**
 * Generates a text-based stat bar.
 * Uses ─█░ (works in both proportional and monospace fonts in markdown).
 * For English, uses ██░░░░░░░░ style (CSS-aware characters).
 */
function statBar(score: number, lang: Lang): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  if (lang === 'zh') {
    return '█'.repeat(filled) + '　'.repeat(empty); // full-width space in Chinese mode
  }
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function generateConfig(
  name: string,
  typeName: string,
  desc: string,
  traits: string[],
  commLines: string[],
  workLines: string[],
  growLines: string[],
  domain: string,
  memory: string,
  boundary: string,
  forbidden_zh: string[],
  forbidden_en: string[],
  stats: PersonalityStats,
  lang: Lang,
): string {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  const date = new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const sl = (k: keyof PersonalityStats) => STAT_LABELS[lang][k];
  const divider = '───';

  // Descriptions for each dimension level
  const levelDesc = (key: keyof PersonalityStats) => {
    const v = stats[key];
    if (lang === 'zh') {
      const map: Record<keyof PersonalityStats, [number, string, string]> = {
        initiative: [70, '高度主动', '指令响应型'],
        clarity: [70, '表达清晰', '简洁至上'],
        honesty: [70, '直言不讳', '共情优先'],
        execution: [70, '敏捷执行', '方案参谋'],
        empathy: [70, '高度共情', '专业严谨'],
      };
      const [, high, low] = map[key];
      return v >= 70 ? high : v >= 40 ? '适度' + high : low;
    } else {
      const map: Record<keyof PersonalityStats, [number, string, string]> = {
        initiative: [70, 'Highly proactive', 'Directive-responsive'],
        clarity: [70, 'Crystal clear', 'Concise-first'],
        honesty: [70, 'Radically frank', 'Empathy-first'],
        execution: [70, 'Agile executor', 'Strategic advisor'],
        empathy: [70, 'Highly empathetic', 'Rigorously professional'],
      };
      const [, high, low] = map[key];
      return v >= 70 ? high : v >= 40 ? 'Moderately ' + high.toLowerCase() : low;
    }
  };

  const mkRow = (key: keyof PersonalityStats) => {
    const bar = statBar(stats[key], lang);
    return `| ${sl(key)} | ${bar} | ${levelDesc(key)} |`;
  };

  if (lang === 'zh') {
    return `# ${name} · 专属 AI 系统配置

> 生成日期：${date}  
> 类型：${typeName}

${divider}

## 角色定义

${desc}

**核心性格特征：** ${traits.join(' · ')}

## 服务领域

${domain}

## 沟通准则

${commLines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## 工作方式

${workLines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## 成长支持

${growLines.join('\n')}

## 记忆与个性化

${memory}

## 边界意识

${boundary}

## 禁止行为

${forbidden_zh.length > 0
    ? forbidden_zh.map((f, i) => `${i + 1}. 永远不要：${f}`).join('\n')
    : '无特别禁止项，遵循常识和专业判断。'}

## 能力画像

| 维度 | 评分 | 说明 |
|------|------|------|
${mkRow('initiative')}
${mkRow('clarity')}
${mkRow('honesty')}
${mkRow('execution')}
${mkRow('empathy')}

---

*此配置由 AURA 生成，适用场景：AI 助手人格设定、系统 Prompt 优化、个人知识管理助手配置。*
`;
  } else {
    return `# ${name} · Personal AI System Config

> Generated: ${date}  
> Type: ${typeName}

${divider}

## Role Definition

${desc}

**Core Traits:** ${traits.join(' · ')}

## Service Domain

${domain.replace('包括但不限于', 'including but not limited to').replace('：', ': ')}

## Communication Guidelines

${commLines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## Work Style

${workLines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## Growth Support

${growLines.join('\n')}

## Memory & Personalization

${memory}

## Boundary Awareness

${boundary}

## Prohibited Behaviors

${forbidden_en.length > 0
    ? forbidden_en.map((f, i) => `${i + 1}. Never: ${f}`).join('\n')
    : 'No special prohibitions — follow common sense and professional judgment.'}

## Ability Profile

| Dimension | Score | Description |
|-----------|-------|-------------|
${mkRow('initiative')}
${mkRow('clarity')}
${mkRow('honesty')}
${mkRow('execution')}
${mkRow('empathy')}

---

*Generated by AURA — for AI personality configuration, system prompt optimization, and personal knowledge assistant setup.*
`;
  }
}
