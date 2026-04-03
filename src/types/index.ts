// 问题和选项类型
export interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  options: Option[];
}

// 用户答案
export type Answers = Record<string, string>;

// 人格统计维度
export interface PersonalityStats {
  initiative: number;
  clarity: number;
  honesty: number;
  execution: number;
  empathy: number;
}

// 构建结果
export interface BuildResult {
  name: string;
  traits: string[];
  typeName: string;
  desc: string;
  commLines: string[];
  workLines: string[];
  growLines: string[];
  behaviorLines: string[];
  stats: PersonalityStats;
  configText: string;
}

// 语言
export type Lang = 'zh' | 'en';

// 页面状态
export type PageState = 'welcome' | 'quiz' | 'loading' | 'result';

// 结果标签
export type ResultTab = 'overview' | 'detail' | 'config' | 'aiEnhance';
