// NBTI 测试 - 24 道情境题
// 维度：E/I（外向/内向）、S/N（感知/直觉）、T/F（思考/情感）、J/P（判断/感知）
// 额外维度：硅基/碳基倾向

export interface NBTIQuestion {
  id: number;
  scenario: string; // 情境描述
  options: Array<{
    text: string;
    scores: {
      E?: number; I?: number;
      S?: number; N?: number;
      T?: number; F?: number;
      J?: number; P?: number;
      silicon?: number; carbon?: number; // 硅基/碳基
    };
  }>;
}

export const nbtiQuestions: NBTIQuestion[] = [
  // E/I 维度 (1-6题)
  {
    id: 1,
    scenario: "周五晚上，你终于下班了。你会？",
    options: [
      { text: "约朋友出来嗨，一个人待着多无聊", scores: { E: 3, carbon: 2 } },
      { text: "回家躺平，社交能量已耗尽", scores: { I: 3, carbon: 1 } },
      { text: "打开多个聊天窗口同时聊", scores: { E: 2, silicon: 2 } },
      { text: "戴上降噪耳机，世界与我无关", scores: { I: 2, silicon: 1, carbon: 1 } },
    ]
  },
  {
    id: 2,
    scenario: "在聚会上，你更倾向于？",
    options: [
      { text: "全场认识一遍，加微信加到手软", scores: { E: 3, carbon: 2 } },
      { text: "和认识的人聊天，不主动扩展社交圈", scores: { I: 2, carbon: 1 } },
      { text: "躲在角落玩手机，假装很忙", scores: { I: 3, silicon: 2 } },
      { text: "成为话题中心，不说话会死", scores: { E: 3, carbon: 2 } },
    ]
  },
  {
    id: 3,
    scenario: "你的朋友圈/动态通常是？",
    options: [
      { text: "三天可见，发完就删", scores: { I: 2, silicon: 1 } },
      { text: "每天更新，生活直播", scores: { E: 2, carbon: 2 } },
      { text: "只转发链接和表情包，不发个人内容", scores: { I: 1, silicon: 3 } },
      { text: "精心修图配文案，等点赞", scores: { E: 1, carbon: 2 } },
    ]
  },
  {
    id: 4,
    scenario: "有人突然发消息问你'在吗'，你的反应是？",
    options: [
      { text: "秒回：在在在！怎么了？", scores: { E: 2, carbon: 2 } },
      { text: "假装没看见，等对方说正事", scores: { I: 2, silicon: 1 } },
      { text: "心里慌：完了，是不是要借钱", scores: { I: 2, carbon: 2 } },
      { text: "直接不回，看对方会不会打电话", scores: { I: 3, silicon: 2 } },
    ]
  },
  {
    id: 5,
    scenario: "团建活动宣布要玩破冰游戏，你的内心OS是？",
    options: [
      { text: "太棒了！让我来活跃气氛", scores: { E: 3, carbon: 2 } },
      { text: "救命，让我消失", scores: { I: 3, carbon: 1 } },
      { text: "计算一下请假是否划算", scores: { I: 2, T: 1, silicon: 2 } },
      { text: "表面微笑，内心已在策划逃跑路线", scores: { I: 2, silicon: 1, carbon: 1 } },
    ]
  },
  {
    id: 6,
    scenario: "周末计划突然被取消，你的感受？",
    options: [
      { text: "快乐！终于可以躺了", scores: { I: 3, carbon: 1 } },
      { text: "空虚，得赶紧找点事做", scores: { E: 2, carbon: 2 } },
      { text: "迅速打开B站/游戏，计划已就绪", scores: { I: 1, silicon: 2 } },
      { text: "联系其他朋友，今天必须出门", scores: { E: 3, carbon: 2 } },
    ]
  },

  // S/N 维度 (7-12题)
  {
    id: 7,
    scenario: "学习新技能时，你更喜欢？",
    options: [
      { text: "跟着教程一步步来，不跳步骤", scores: { S: 3, silicon: 1 } },
      { text: "先看整体架构，再补充细节", scores: { N: 3, silicon: 1 } },
      { text: "直接上手试，遇到问题再查", scores: { S: 1, N: 1, carbon: 2 } },
      { text: "看三个教程对比，找出最优解", scores: { N: 2, silicon: 2 } },
    ]
  },
  {
    id: 8,
    scenario: "描述一件事物时，你更倾向于？",
    options: [
      { text: "具体的细节和例子", scores: { S: 3, carbon: 1 } },
      { text: "抽象的概念和比喻", scores: { N: 3, silicon: 1 } },
      { text: "用数据说话", scores: { S: 2, T: 1, silicon: 2 } },
      { text: "讲故事，引人入胜", scores: { N: 2, F: 1, carbon: 2 } },
    ]
  },
  {
    id: 9,
    scenario: "看一部电影后，你更容易记住？",
    options: [
      { text: "具体的台词和画面", scores: { S: 3, carbon: 1 } },
      { text: "整体的氛围和感受", scores: { N: 2, F: 1, carbon: 2 } },
      { text: "剧情漏洞和逻辑问题", scores: { S: 1, N: 1, T: 2, silicon: 1 } },
      { text: "深层主题和隐喻", scores: { N: 3, silicon: 1 } },
    ]
  },
  {
    id: 10,
    scenario: "布置房间时，你的风格是？",
    options: [
      { text: "实用主义，该在哪在哪", scores: { S: 2, J: 1, silicon: 1 } },
      { text: "创意混搭，看心情来", scores: { N: 2, P: 1, carbon: 2 } },
      { text: "极简主义，能不要就不要", scores: { S: 1, N: 1, silicon: 3 } },
      { text: "主题风格，每个角落都有故事", scores: { N: 3, F: 1, carbon: 1 } },
    ]
  },
  {
    id: 11,
    scenario: "朋友说'我没事'，你觉得？",
    options: [
      { text: "那就是没事", scores: { S: 3, T: 1, silicon: 2 } },
      { text: "肯定有事，得追问", scores: { N: 2, F: 2, carbon: 2 } },
      { text: "看语气和表情判断", scores: { S: 1, N: 1, F: 2, carbon: 2 } },
      { text: "开启'我没事'翻译模式", scores: { N: 3, F: 1, silicon: 1 } },
    ]
  },
  {
    id: 12,
    scenario: "面对一个复杂问题，你的处理方式？",
    options: [
      { text: "拆解成小步骤，逐个击破", scores: { S: 3, J: 1, silicon: 1 } },
      { text: "先找规律，用直觉跳过中间步骤", scores: { N: 3, P: 1, silicon: 1 } },
      { text: "搜集大量案例，类比推理", scores: { S: 2, N: 1, carbon: 2 } },
      { text: "发散思考，找出多种可能", scores: { N: 3, P: 1, carbon: 1 } },
    ]
  },

  // T/F 维度 (13-18题)
  {
    id: 13,
    scenario: "朋友找你吐槽，你更可能？",
    options: [
      { text: "一起骂，情绪共鸣", scores: { F: 3, carbon: 2 } },
      { text: "分析问题，给解决方案", scores: { T: 3, silicon: 1 } },
      { text: "先共情，再分析", scores: { F: 1, T: 1, carbon: 2 } },
      { text: "转移话题，不想听负能量", scores: { T: 1, silicon: 2 } },
    ]
  },
  {
    id: 14,
    scenario: "做决定时，你更看重？",
    options: [
      { text: "逻辑和效率", scores: { T: 3, silicon: 2 } },
      { text: "对他人的影响", scores: { F: 3, carbon: 2 } },
      { text: "数据和分析", scores: { T: 2, silicon: 2 } },
      { text: "直觉和感受", scores: { F: 2, N: 1, carbon: 2 } },
    ]
  },
  {
    id: 15,
    scenario: "看到有人哭，你的第一反应？",
    options: [
      { text: "递纸巾，陪着一起难受", scores: { F: 3, carbon: 2 } },
      { text: "问发生了什么，然后分析", scores: { T: 2, silicon: 1 } },
      { text: "不知所措，尴尬地走开", scores: { T: 1, I: 1, silicon: 1 } },
      { text: "感同身受，可能也跟着哭", scores: { F: 3, carbon: 3 } },
    ]
  },
  {
    id: 16,
    scenario: "评价一部作品，你更在意？",
    options: [
      { text: "技术水平和完成度", scores: { T: 3, S: 1, silicon: 2 } },
      { text: "情感共鸣和表达", scores: { F: 3, N: 1, carbon: 2 } },
      { text: "创新性和突破", scores: { T: 1, F: 1, N: 2, silicon: 1 } },
      { text: "能否感动我", scores: { F: 3, carbon: 2 } },
    ]
  },
  {
    id: 17,
    scenario: "批评别人时，你会？",
    options: [
      { text: "直说，对事不对人", scores: { T: 3, silicon: 1 } },
      { text: "先夸再委婉提建议", scores: { F: 3, carbon: 2 } },
      { text: "发一长串分析文", scores: { T: 2, silicon: 2 } },
      { text: "选择不批评，维持和气", scores: { F: 3, carbon: 2 } },
    ]
  },
  {
    id: 18,
    scenario: "被批评时，你的反应？",
    options: [
      { text: "虚心接受，理性分析对错", scores: { T: 3, silicon: 1 } },
      { text: "表面平静，内心翻江倒海", scores: { F: 2, carbon: 2 } },
      { text: "当场辩论，证明我没错", scores: { T: 2, E: 1, carbon: 1 } },
      { text: "记在心里，可能很久都忘不掉", scores: { F: 3, carbon: 2 } },
    ]
  },

  // J/P 维度 (19-24题)
  {
    id: 19,
    scenario: "你的旅行方式是？",
    options: [
      { text: "详细攻略，精确到小时", scores: { J: 3, silicon: 1 } },
      { text: "说走就走，随遇而安", scores: { P: 3, carbon: 2 } },
      { text: "有大致计划，但留足弹性", scores: { J: 1, P: 1, carbon: 2 } },
      { text: "只订机票酒店，其他到时候再说", scores: { P: 3, carbon: 1 } },
    ]
  },
  {
    id: 20,
    scenario: "截止日期逼近，你的状态是？",
    options: [
      { text: "早就完成了，现在在优化", scores: { J: 3, silicon: 1 } },
      { text: "最后三天狂赶，效率爆表", scores: { P: 3, carbon: 2 } },
      { text: "每天推进一点，稳稳当当", scores: { J: 2, carbon: 1 } },
      { text: "最后两小时极限操作", scores: { P: 3, silicon: 1 } },
    ]
  },
  {
    id: 21,
    scenario: "你的桌面/房间通常是？",
    options: [
      { text: "整洁有序，每样东西有固定位置", scores: { J: 3, S: 1, silicon: 1 } },
      { text: "看起来乱，但我找得到", scores: { P: 3, carbon: 2 } },
      { text: "周期性混乱，然后大整理", scores: { P: 2, J: 1, carbon: 2 } },
      { text: "极简，没有多余的东西", scores: { J: 2, silicon: 2 } },
    ]
  },
  {
    id: 22,
    scenario: "约定好的计划突然变动，你会？",
    options: [
      { text: "重新规划，确保一切在掌控中", scores: { J: 3, silicon: 1 } },
      { text: "无所谓，变化也挺有意思", scores: { P: 3, carbon: 2 } },
      { text: "有点不爽，但能适应", scores: { J: 2, P: 1, carbon: 2 } },
      { text: "太好了，计划什么的都不重要", scores: { P: 3, carbon: 1 } },
    ]
  },
  {
    id: 23,
    scenario: "关于待办事项，你的习惯是？",
    options: [
      { text: "列清单，完成一项划掉一项，爽", scores: { J: 3, silicon: 1 } },
      { text: "心里有数，写下来反而有压力", scores: { P: 2, carbon: 2 } },
      { text: "列了清单但经常完不成", scores: { P: 2, carbon: 2 } },
      { text: "清单是给机器用的，我靠直觉", scores: { P: 3, silicon: 2 } },
    ]
  },
  {
    id: 24,
    scenario: "你在团队项目中的角色通常是？",
    options: [
      { text: "定计划、催进度、保交付", scores: { J: 3, T: 1, silicon: 1 } },
      { text: "出创意、找灵感、打破常规", scores: { P: 3, N: 1, carbon: 2 } },
      { text: "见机行事，哪里需要去哪里", scores: { P: 2, carbon: 2 } },
      { text: "默默执行，不给别人添麻烦", scores: { J: 2, I: 1, carbon: 1 } },
    ]
  },
];

// 16种人格类型定义
export interface NBTIType {
  code: string; // 如 "INTP"
  name: string; // 如 "逻辑学家"
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  siliconCarbon: 'silicon' | 'carbon' | 'hybrid'; // 倾向
  element: string; // 灵魂元素
  title: string; // 酷炫称号
  roast: string; // 毒舌解读
  strengths: string[];
  weaknesses: string[];
  motto: string;
}

export const nbtiTypes: Record<string, NBTIType> = {
  INTJ: {
    code: 'INTJ',
    name: '战略家',
    rarity: 'rare',
    siliconCarbon: 'silicon',
    element: '量子',
    title: '洞悉一切的幕后操盘手',
    roast: '你以为自己是下棋的人，其实你只是棋盘上最孤独的那颗棋子。你的朋友圈里没有朋友，只有"人脉资源"。深夜emo时，你用Excel分析自己的人生。',
    strengths: ['战略规划', '独立思考', '高效执行', '问题解决'],
    weaknesses: ['情感表达困难', '社交恐惧', '过度分析', '完美主义'],
    motto: '一切皆可优化，包括人际关系。',
  },
  INTP: {
    code: 'INTP',
    name: '逻辑学家',
    rarity: 'rare',
    siliconCarbon: 'silicon',
    element: '数据',
    title: '脑子里开了500个标签页',
    roast: '你的浏览器标签页数量超过了中国总人口。你的房间是熵增定律的完美诠释，但你坚持认为这是"有序的混乱"。deadline是你唯一的生产力工具。',
    strengths: ['深度分析', '创新思维', '独立研究', '学习能力'],
    weaknesses: ['拖延症晚期', '社交尴尬', '行动力低', '容易走神'],
    motto: '我思考，故我还没开始行动。',
  },
  ENTJ: {
    code: 'ENTJ',
    name: '指挥官',
    rarity: 'epic',
    siliconCarbon: 'hybrid',
    element: '火焰',
    title: '天生的CEO，努力的暴君',
    roast: '你的微信备注里，朋友都被标注了"可用价值"。你的人生目标是在任何场合成为最有权力的人，包括在火锅店抢锅。',
    strengths: ['领导力', '决策力', '战略眼光', '执行力'],
    weaknesses: ['控制欲强', '缺乏耐心', '情感钝感', '容易强势'],
    motto: '不听我的听谁的？',
  },
  ENTP: {
    code: 'ENTP',
    name: '辩论家',
    rarity: 'uncommon',
    siliconCarbon: 'hybrid',
    element: '电流',
    title: '为了抬杠而生的杠精之王',
    roast: '你能在三句话内把任何话题变成辩论赛，包括"今天天气不错"。你的爱好包括：反对一切、扮演魔鬼代言人、以及在评论区吵架。',
    strengths: ['快速思考', '辩论能力', '创新精神', '应变能力'],
    weaknesses: ['好辩成性', '缺乏恒心', '容易无聊', '戳人痛点'],
    motto: '我不同意你的观点，而且我会告诉你。',
  },
  INFJ: {
    code: 'INFJ',
    name: '提倡者',
    rarity: 'legendary',
    siliconCarbon: 'carbon',
    element: '星光',
    title: '人群中最稀有的灵魂',
    roast: '你自称社恐，但其实你只是社恐于和肤浅的人社交。你的共情能力强大到能感受到路边石头的心情。你每天都在拯救世界，就是救不了自己的拖延症。',
    strengths: ['深刻洞察', '同理心强', '理想主义', '坚持价值观'],
    weaknesses: ['完美主义', '容易耗竭', '过度敏感', '理想化'],
    motto: '我在理解你之前，你已经在我心里了。',
  },
  INFP: {
    code: 'INFP',
    name: '调停者',
    rarity: 'uncommon',
    siliconCarbon: 'carbon',
    element: '月光',
    title: '现实世界里的童话创作者',
    roast: '你的脑内剧场每天都在上映奥斯卡级别的电影，现实中却连点外卖都要纠结半小时。你相信每个人都有善良的一面，包括插队的大妈。',
    strengths: ['创造力', '同理心', '理想主义', '艺术天赋'],
    weaknesses: ['过于理想', '情绪敏感', '逃避现实', '难以决断'],
    motto: '现实太无聊，我选择沉浸。',
  },
  ENFJ: {
    code: 'ENFJ',
    name: '主人公',
    rarity: 'epic',
    siliconCarbon: 'carbon',
    element: '阳光',
    title: '行走的正能量发电站',
    roast: '你是朋友圈里的心理辅导员、职业规划师、情感专栏作家三合一。你的热情能照亮整个房间，但也让社恐们想钻地洞。',
    strengths: ['领导魅力', '同理心强', '沟通能力', '感染力'],
    weaknesses: ['过度付出', '忽视自己', '太在意评价', '容易耗竭'],
    motto: '让我来照亮你的世界。',
  },
  ENFP: {
    code: 'ENFP',
    name: '竞选者',
    rarity: 'uncommon',
    siliconCarbon: 'carbon',
    element: '彩虹',
    title: '全宇宙的灵感收集器',
    roast: '你是社交圈里的烟花，灿烂但短暂。你的计划清单上写满了"新项目"，但没有一个"已完成"。你的心情像股市K线，没有中间值。',
    strengths: ['热情感染', '创意无限', '社交能力', '适应性'],
    weaknesses: ['三分钟热度', '注意力分散', '情绪波动', '难以坚持'],
    motto: '今天我热爱这个，明天再说。',
  },
  ISTJ: {
    code: 'ISTJ',
    name: '物流师',
    rarity: 'common',
    siliconCarbon: 'silicon',
    element: '钢铁',
    title: '规则的守护者，效率的信徒',
    roast: '你的生活像Excel表格一样精密。你坚信正确的方法只有一种，就是你的方法。你把"按流程办事"纹在了心上。',
    strengths: ['可靠性', '责任心', '条理性', '执行力'],
    weaknesses: ['固执保守', '灵活性差', '情感表达少', '抗拒变化'],
    motto: '流程大于一切，包括你。',
  },
  ISFJ: {
    code: 'ISFJ',
    name: '守卫者',
    rarity: 'common',
    siliconCarbon: 'carbon',
    element: '大地',
    title: '默默付出的无名英雄',
    roast: '你是团队里那个永远提前到场、最后离开的人。你的付出被所有人当作理所当然，包括你自己。学会说"不"可能会让你的人生崩塌。',
    strengths: ['可靠踏实', '体贴周到', '责任心强', '忠诚'],
    weaknesses: ['不懂拒绝', '忽视自己', '抗拒变化', '过度付出'],
    motto: '我来做吧，反正你也不会。',
  },
  ESTJ: {
    code: 'ESTJ',
    name: '总经理',
    rarity: 'common',
    siliconCarbon: 'hybrid',
    element: '岩石',
    title: '天生的管理者，努力的传统守护者',
    roast: '你的人生信条是"自古以来的规矩"，尽管那个规矩可能只是三年前你自己定的。你的领导风格像军训教官，效率惊人，怨气也惊人。',
    strengths: ['执行力强', '组织能力', '责任感', '目标导向'],
    weaknesses: ['控制欲强', '固执己见', '缺乏灵活性', '情感表达少'],
    motto: '别废话，照我说的做。',
  },
  ESFJ: {
    code: 'ESFJ',
    name: '执政官',
    rarity: 'common',
    siliconCarbon: 'carbon',
    element: '花朵',
    title: '社交圈的润滑剂和八卦中心',
    roast: '你记得每个朋友的生日、喜好、最近的吐槽，但可能不记得自己上周说了什么。你的关心有时候像卫星定位一样精确且令人窒息。',
    strengths: ['社交能力', '体贴周到', '责任心强', '团队协作'],
    weaknesses: ['在意评价', '八卦体质', '难以拒绝', '过度付出'],
    motto: '我知道你需要什么，比你自己还清楚。',
  },
  ISTP: {
    code: 'ISTP',
    name: '鉴赏家',
    rarity: 'uncommon',
    siliconCarbon: 'silicon',
    element: '芯片',
    title: '万能的故障排除者',
    roast: '你能修好任何东西，包括你那糟糕的人际关系——开玩笑的，你从不修复人际关系。你的情感表达系统像早期的Windows，功能有但很少用。',
    strengths: ['动手能力', '问题解决', '冷静理性', '适应力'],
    weaknesses: ['情感疏离', '冲动冒险', '计划性差', '承诺恐惧'],
    motto: '能修就修，不能修换新的。',
  },
  ISFP: {
    code: 'ISFP',
    name: '探险家',
    rarity: 'uncommon',
    siliconCarbon: 'carbon',
    element: '水墨',
    title: '低调的艺术家，隐藏的美学家',
    roast: '你的审美品味是你的秘密武器，社交能力是你的公开短板。你的人生是场无声电影，内容丰富但没人看得懂字幕。',
    strengths: ['艺术天赋', '审美能力', '适应力强', '温和友善'],
    weaknesses: ['回避冲突', '表达困难', '计划性差', '容易受伤'],
    motto: '世界很吵，我选择安静地美。',
  },
  ESTP: {
    code: 'ESTP',
    name: '企业家',
    rarity: 'common',
    siliconCarbon: 'carbon',
    element: '雷电',
    title: '行走的肾上腺素',
    roast: '你的座右铭是"先做再说，出事再改"。你的冒险精神令人钦佩，你的安全意识令人担忧。你的余生可能在还年轻时冲动下的债。',
    strengths: ['行动力强', '随机应变', '社交魅力', '冒险精神'],
    weaknesses: ['冲动鲁莽', '缺乏规划', '承诺困难', '不耐烦'],
    motto: '想什么想，冲就完了！',
  },
  ESFP: {
    code: 'ESFP',
    name: '表演者',
    rarity: 'common',
    siliconCarbon: 'carbon',
    element: '烟火',
    title: '人群中的聚光灯',
    roast: '你是派对的灵魂，也是朋友们凌晨三点的头疼来源。你的人生信条是"活在当下"，你的钱包对此表示强烈抗议。',
    strengths: ['社交魅力', '热情活力', '感染力强', '适应力'],
    weaknesses: ['三分钟热度', '逃避计划', '容易分心', '冲动消费'],
    motto: '今天开心就好，明天的事明天愁。',
  },
};

// 稀有度配置
export const rarityConfig = {
  common: { label: '普通', color: '#9ca3af', glow: '', rate: '30%' },
  uncommon: { label: '稀有', color: '#22c55e', glow: '0 0 20px rgba(34,197,94,0.5)', rate: '25%' },
  rare: { label: '史诗', color: '#3b82f6', glow: '0 0 20px rgba(59,130,246,0.5)', rate: '20%' },
  epic: { label: '传说', color: '#a855f7', glow: '0 0 25px rgba(168,85,247,0.5)', rate: '15%' },
  legendary: { label: '神话', color: '#f59e0b', glow: '0 0 30px rgba(245,158,11,0.5)', rate: '8%' },
  mythic: { label: '至高', color: '#ef4444', glow: '0 0 35px rgba(239,68,68,0.5)', rate: '2%' },
};
