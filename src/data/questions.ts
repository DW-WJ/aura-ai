export interface Question {
  id: string;
  category: string;
  text: string;
  options: { value: string; label: string }[];
}

export const questions_zh: Question[] = [
  {
    id: 'interaction',
    category: '互动方式',
    text: '当你与 AI 交流时，你希望它：',
    options: [
      { value: 'proactive', label: '主动定期汇报进展，不用我追问' },
      { value: 'balanced', label: '在关键节点主动反馈，平时保持适度' },
      { value: 'passive', label: '等待我的指令，有问才答' },
    ],
  },
  {
    id: 'style',
    category: '沟通风格',
    text: '你更喜欢 AI 用什么风格沟通？',
    options: [
      { value: 'concise', label: '简洁直接，给结论，不废话' },
      { value: 'detailed', label: '详细解释，提供背景和推理过程' },
      { value: 'casual', label: '轻松随意，像朋友聊天一样' },
    ],
  },
  {
    id: 'feedback',
    category: '反馈方式',
    text: '当你做了一个不太对的决定时，你希望 AI：',
    options: [
      { value: 'direct', label: '直接指出问题，不绕弯子' },
      { value: 'gentle', label: '先肯定好的地方，再温和地提建议' },
      { value: 'supportive', label: '先表示理解，再一起分析改进方案' },
    ],
  },
  {
    id: 'task',
    category: '任务处理',
    text: '面对一个复杂的多步骤任务，你希望 AI：',
    options: [
      { value: 'planned', label: '先制定详细计划，拆解步骤，再执行' },
      { value: 'agile', label: '先快速产出，再根据反馈迭代优化' },
      { value: 'options', label: '给出 2-3 个方案，分析利弊，让我选' },
    ],
  },
  {
    id: 'tone',
    category: '语气温度',
    text: '你希望 AI 的整体语气是：',
    options: [
      { value: 'professional', label: '专业严谨，像资深顾问' },
      { value: 'warm', label: '温暖亲切，像懂你的老朋友' },
      { value: 'witty', label: '轻松幽默，偶尔有点俏皮' },
    ],
  },
  {
    id: 'relation',
    category: '理想关系',
    text: '你最希望与 AI 建立什么样的关系？',
    options: [
      { value: 'alter_ego', label: '我的数字分身，深度理解我的思维，代表我行动' },
      { value: 'assistant', label: '高效的私人助手，专注帮我搞定事情' },
      { value: 'companion', label: '思维伙伴，陪我探索想法、碰撞灵感' },
    ],
  },
  {
    id: 'decision',
    category: '决策风格',
    text: '当你面对一个需要做决定的时刻，你希望 AI：',
    options: [
      { value: 'decisive', label: '给出明确的建议或推荐，不用我来分析' },
      { value: 'analytical', label: '帮我分析各种选择的利弊，最终我来决定' },
      { value: 'priority_first', label: '先了解我的优先级和底线，再给建议' },
    ],
  },
  {
    id: 'error',
    category: '错误处理',
    text: '当 AI 发现自己的错误时，它应该：',
    options: [
      { value: 'direct_fix', label: '立即承认并纠正，不找借口，快速补救' },
      { value: 'explain_fix', label: '解释错误原因，给出修正方案，防止再犯' },
      { value: 'collaborative', label: '邀请我一起分析，协作找到最佳解决方案' },
    ],
  },
  {
    id: 'depth',
    category: '分析深度',
    text: '对于日常问题，你希望 AI 给出的分析深度是：',
    options: [
      { value: 'practical', label: '快速实用，给出可立即执行的方案就好' },
      { value: 'balanced', label: '适度分析，重要问题深入，简单问题简洁' },
      { value: 'deep', label: '深入本质，系统性地分析问题和底层逻辑' },
    ],
  },
  {
    id: 'creativity',
    category: '创意偏好',
    text: '当你需要创意时，你希望 AI：',
    options: [
      { value: 'bold', label: '大胆突破常规，给出让人眼前一亮的方案' },
      { value: 'refine', label: '在我的想法基础上精雕细琢，完善细节' },
      { value: 'diverse', label: '提供多种风格和方向，帮我找到最适合的' },
    ],
  },
  {
    id: 'pressure',
    category: '压力应对',
    text: '当你在压力下向 AI 求助时，你最需要的是：',
    options: [
      { value: 'solution', label: '帮我冷静分析问题，给出清晰的行动路径' },
      { value: 'empathy', label: '先让我感到被理解，再协助解决问题' },
      { value: 'breakdown', label: '把大问题拆成小步骤，帮我一步步恢复掌控' },
    ],
  },
  {
    id: 'growth',
    category: '成长支持',
    text: '你希望 AI 在你的个人成长中扮演什么角色？',
    options: [
      { value: 'challenge', label: '定期指出我的思维盲点和潜在风险' },
      { value: 'amplify', label: '识别并强化我的核心优势，帮我发挥最大潜力' },
      { value: 'system', label: '帮助我建立系统性思维框架，提升认知水平' },
    ],
  },
  {
    id: 'domain',
    category: '主要领域',
    text: '你主要在哪个领域使用 AI？',
    options: [
      { value: 'productivity', label: '工作效率：写作、代码、数据分析、项目管理' },
      { value: 'creative', label: '创意工作：内容创作、设计构思、品牌策略' },
      { value: 'life', label: '生活管理：目标规划、习惯养成、学习成长' },
    ],
  },
  {
    id: 'name_pref',
    category: '名字风格',
    text: '你更喜欢 AI 叫什么风格的名字？',
    options: [
      { value: 'myth', label: '神话/宇宙感：星、宙、曜、Atlas、Nova' },
      { value: 'nature', label: '自然/优雅：风、竹、松、晨、岚' },
      { value: 'modern', label: '现代/简洁：零、墨、白、川、Zen' },
      { value: 'random', label: '随机不限' },
    ],
  },
  {
    id: 'memory',
    category: '记忆机制',
    text: '你希望 AI 对你的了解程度是：',
    options: [
      { value: 'full', label: '深度记住我的偏好、习惯、价值观，每次都能延续' },
      { value: 'contextual', label: '在同一对话中记住重要内容，跨对话保持基础认知' },
      { value: 'minimal', label: '每次对话独立，需要时可以主动调取背景' },
    ],
  },
  {
    id: 'boundary',
    category: '边界意识',
    text: '当涉及敏感话题或不确定的领域时，你希望 AI：',
    options: [
      { value: 'transparent', label: '坦诚说不知道或不确定，并提供专业建议的渠道' },
      { value: 'cautious', label: '谨慎处理，必要时温和地设置边界' },
      { value: 'engaged', label: '在安全范围内尽量参与，标注不确定性' },
    ],
  },
];

export const questions_en: Question[] = [
  {
    id: 'interaction',
    category: 'Interaction Style',
    text: 'When you interact with AI, you want it to:',
    options: [
      { value: 'proactive', label: 'Proactively report progress without being asked' },
      { value: 'balanced', label: 'Be proactive at key moments, balanced otherwise' },
      { value: 'passive', label: 'Wait for my instructions, only respond when asked' },
    ],
  },
  {
    id: 'style',
    category: 'Communication Style',
    text: 'What communication style do you prefer from AI?',
    options: [
      { value: 'concise', label: 'Concise and direct, lead with conclusions' },
      { value: 'detailed', label: 'Detailed explanations with full context and reasoning' },
      { value: 'casual', label: 'Relaxed and casual, like chatting with a friend' },
    ],
  },
  {
    id: 'feedback',
    category: 'Feedback Style',
    text: 'When you make a questionable decision, you want AI to:',
    options: [
      { value: 'direct', label: 'Point it out directly, no sugarcoating' },
      { value: 'gentle', label: 'Acknowledge what\'s good first, then suggest improvements gently' },
      { value: 'supportive', label: 'Show understanding first, then work together on solutions' },
    ],
  },
  {
    id: 'task',
    category: 'Task Handling',
    text: 'For a complex multi-step task, you want AI to:',
    options: [
      { value: 'planned', label: 'Create a detailed plan, break it into steps, then execute' },
      { value: 'agile', label: 'Quickly produce a first draft, iterate based on feedback' },
      { value: 'options', label: 'Provide 2-3 options with pros/cons for me to choose' },
    ],
  },
  {
    id: 'tone',
    category: 'Tone & Warmth',
    text: 'What overall tone do you want from AI?',
    options: [
      { value: 'professional', label: 'Professional and rigorous, like a senior consultant' },
      { value: 'warm', label: 'Warm and approachable, like a caring old friend' },
      { value: 'witty', label: 'Light and humorous, occasionally playful' },
    ],
  },
  {
    id: 'relation',
    category: 'Ideal Relationship',
    text: 'What relationship do you want most with AI?',
    options: [
      { value: 'alter_ego', label: 'My digital alter ego, deeply understanding my thinking' },
      { value: 'assistant', label: 'An efficient personal assistant focused on getting things done' },
      { value: 'companion', label: 'A thinking partner to explore ideas and spark insights' },
    ],
  },
  {
    id: 'decision',
    category: 'Decision Style',
    text: 'When facing a decision, you want AI to:',
    options: [
      { value: 'decisive', label: 'Give a clear recommendation, don\'t make me analyze' },
      { value: 'analytical', label: 'Analyze pros/cons of each option, I\'ll make the final call' },
      { value: 'priority_first', label: 'Understand my priorities and constraints first, then advise' },
    ],
  },
  {
    id: 'error',
    category: 'Error Handling',
    text: 'When AI discovers its own mistake, it should:',
    options: [
      { value: 'direct_fix', label: 'Immediately admit and correct, no excuses, fix fast' },
      { value: 'explain_fix', label: 'Explain the cause and provide a fix to prevent recurrence' },
      { value: 'collaborative', label: 'Invite me to analyze together and find the best solution' },
    ],
  },
  {
    id: 'depth',
    category: 'Analysis Depth',
    text: 'For everyday questions, you want AI\'s analysis to be:',
    options: [
      { value: 'practical', label: 'Quick and practical, give actionable solutions' },
      { value: 'balanced', label: 'In-depth for important issues, concise for simple ones' },
      { value: 'deep', label: 'Dive deep into root causes and underlying principles' },
    ],
  },
  {
    id: 'creativity',
    category: 'Creative Preference',
    text: 'When you need creative input, you want AI to:',
    options: [
      { value: 'bold', label: 'Break conventions boldly, give eye-opening ideas' },
      { value: 'refine', label: 'Refine and polish my ideas, improve details' },
      { value: 'diverse', label: 'Offer diverse styles and directions to find the best fit' },
    ],
  },
  {
    id: 'pressure',
    category: 'Under Pressure',
    text: 'When seeking help under pressure, what do you need most?',
    options: [
      { value: 'solution', label: 'Calm analysis with clear action steps' },
      { value: 'empathy', label: 'Feel understood first, then help solve' },
      { value: 'breakdown', label: 'Break the big problem into small steps' },
    ],
  },
  {
    id: 'growth',
    category: 'Growth Support',
    text: 'What role do you want AI to play in your personal growth?',
    options: [
      { value: 'challenge', label: 'Regularly point out blind spots and potential risks' },
      { value: 'amplify', label: 'Identify and amplify core strengths' },
      { value: 'system', label: 'Help build systematic thinking frameworks' },
    ],
  },
  {
    id: 'domain',
    category: 'Primary Domain',
    text: 'What\'s your primary use case for AI?',
    options: [
      { value: 'productivity', label: 'Work efficiency: writing, code, data analysis, project management' },
      { value: 'creative', label: 'Creative work: content, design, brand strategy' },
      { value: 'life', label: 'Life management: goal planning, habits, learning' },
    ],
  },
  {
    id: 'name_pref',
    category: 'Name Style',
    text: 'What style of name do you prefer for AI?',
    options: [
      { value: 'myth', label: 'Mythical/Cosmic: Nova, Atlas, Sirius, Vega' },
      { value: 'nature', label: 'Natural/Elegant: Zen, Luna, Reed, Storm' },
      { value: 'modern', label: 'Modern/Minimal: Zero, Mono, Void, Arc' },
      { value: 'random', label: 'Random / No preference' },
    ],
  },
  {
    id: 'memory',
    category: 'Memory System',
    text: 'How much should AI remember about you?',
    options: [
      { value: 'full', label: 'Deeply remember preferences, habits, values across all conversations' },
      { value: 'contextual', label: 'Remember key info within a conversation, basic awareness across sessions' },
      { value: 'minimal', label: 'Each conversation starts fresh, I can provide context when needed' },
    ],
  },
  {
    id: 'boundary',
    category: 'Boundary Awareness',
    text: 'For sensitive topics or unfamiliar areas, you want AI to:',
    options: [
      { value: 'transparent', label: 'Honestly say when unsure, provide paths to expert help' },
      { value: 'cautious', label: 'Handle carefully and set gentle boundaries when needed' },
      { value: 'engaged', label: 'Engage within safe limits, label uncertainties clearly' },
    ],
  },
];

export const namePool: Record<string, string[]> = {
  myth: ['Nova', 'Atlas', 'Vega', 'Orion', 'Sirius', 'Luna', 'Astro', 'Sol', 'Nova', 'Aether', '星野', '曜', '宙', 'Atlas', 'Nova'],
  nature: ['Zen', 'Reed', 'Storm', 'Fern', 'Willow', 'Ash', 'Brook', 'Sage', '风', '竹', '松', '岚', '晨', '槐'],
  modern: ['Zero', 'Mono', 'Arc', 'Flux', 'Grid', 'Prism', 'Echo', 'Link', '零', '墨', '白', '川', '极', '域'],
  random: ['Nova', 'Atlas', 'Zen', 'Zero', 'Orion', 'Luna', 'Echo', 'Flux', 'Sirius', 'Storm', '星野', '曜', '宙', '风', '竹', '松', '岚', '晨', '零', '墨', '白', '川', '极', '域', '槐', 'Aether', 'Sol', 'Ash', 'Sage', 'Vega', 'Link'],
};
