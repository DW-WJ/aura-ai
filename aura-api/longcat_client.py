"""
LongCat API 调用封装 - 支持流式 & 模型加权随机 & Markdown 元数据解析
"""

import os
import re
import json
import random
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("LONGCAT_API_KEY")
BASE_URL = "https://api.longcat.chat/openai"

if not API_KEY:
    raise ValueError("请在 .env 文件中设置 LONGCAT_API_KEY")

# ─── OpenAI Client ───────────────────────────────────────────────────────────
# 使用新版 openai >= 1.0，无需传 httpx 参数，代理通过环境变量自动生效
try:
    from openai import OpenAI
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
except Exception:
    # 降级：兼容 openai < 1.0
    import openai as _old_openai
    _old_openai.api_key = API_KEY
    _old_openai.api_base = BASE_URL
    client = None


# ─── 模型加权随机 ─────────────────────────────────────────────────────────────

MODEL_POOL = [
    ("LongCat-Flash-Lite", 4),
    ("LongCat-Flash-Chat", 3),
    ("LongCat-Flash-Thinking-2601", 1),
    ("LongCat-Flash-Omni-2603", 1),
]

def pick_model() -> str:
    names = [m for m, _ in MODEL_POOL]
    weights = [w for _, w in MODEL_POOL]
    return random.choices(names, weights=weights, k=1)[0]


# ─── Markdown 元数据解析 ───────────────────────────────────────────────────────

def parse_meta_from_markdown(md: str, lang: str = "zh") -> dict:
    meta = {
        "name": None,
        "typeName": None,
        "desc": None,
        "traits": [],
        "commLines": [],
        "workLines": [],
        "growLines": [],
    }

    if not md:
        return meta

    lines = md.split('\n')
    phase = "init"

    for i, line in enumerate(lines):
        l = line.strip()

        # 名字：匹配 `# AI名字`
        if phase == "init" and re.match(r'^#{1,2}\s+[\u4e00-\u9fff\w\-\.\·]+', l):
            name = re.sub(r'^#+\s+', '', l).strip()
            name = re.sub(r'[*_`~]', '', name).strip()
            name = re.sub(r'\s*[·|·]\s*.+$', '', name).strip()
            if name and len(name) <= 20 and not name.startswith("#"):
                meta["name"] = name
                phase = "name_found"

        # 类型标签
        if meta.get("typeName") is None:
            m = re.search(r'\*\*([\u4e00-\u9fff\w /]+)\*\*', l)
            if m:
                candidate = m.group(1).strip()
                if 2 < len(candidate) < 30:
                    meta["typeName"] = candidate

        # 性格标签
        if phase in ("init", "name_found") and re.match(r'^[-*]\s+\*\*', l):
            trait = re.sub(r'^[-*]\s+\*\*', '', l).replace('**', '').strip()
            trait = re.sub(r'\s*[-:：].+$', '', trait).strip()
            if trait and len(trait) < 20:
                meta["traits"].append(trait)
                phase = "traits_found"

        # 描述段落
        if re.match(r'^#{2,3}\s+.*(角色|定义|Identity|Role|描述|Description)', l):
            for j in range(i + 1, min(i + 5, len(lines))):
                nl = lines[j].strip()
                if not nl or re.match(r'^[-*]\s+', nl) or re.match(r'^[-*]{3,}|---', nl):
                    continue
                desc = re.sub(r'\*+', '', nl).strip()
                if desc:
                    meta["desc"] = desc[:200]
                    break

        # 结构化内容段落
        section_keywords = {
            "comm": ["沟通", "交流", "Communication", "Guidelines"],
            "work": ["工作", "执行", "Work", "Style"],
            "grow": ["成长", "支持", "发展", "Growth"],
        }
        target_map = {"comm": "commLines", "work": "workLines", "grow": "growLines"}

        for key, keywords in section_keywords.items():
            if any(kw in l for kw in keywords) and re.match(r'^#{2,3}\s+', l):
                target = meta[target_map[key]]
                for j in range(i + 1, len(lines)):
                    nl = lines[j]
                    if re.match(r'^#{2,3}\s+', nl.strip()):
                        break
                    m = re.match(r'^(\s*)[-*]\s+(.*)', nl)
                    if m:
                        text = m.group(2).strip()
                        text = re.sub(r'\*+|`[^`]*`', lambda mm: mm.group()[1:-1] if '`' in mm.group() else '', text)
                        text = re.sub(r'[*_`]', '', text).strip()
                        if text and len(text) < 300:
                            target.append(text)
                break

    return meta


# ─── Prompt 构建 ──────────────────────────────────────────────────────────────

def _build_system_prompt(lang: str) -> str:
    if lang == "zh":
        return """你是一位专业的 AI 人格设计专家，擅长根据用户的性格偏好和使用场景，深度优化和扩展 AI System Prompt。

你的输出要求：
1. 保留原有配置的所有维度的核心精神
2. 在此基础上进行深度扩展
3. 语言风格与用户选择的沟通风格高度一致
4. 输出格式保持 Markdown，结构清晰
5. 不要输出任何解释性文字，直接输出优化后的配置本身
6. 在 Markdown 开头用 `# AI名字` 作为标题"""
    else:
        return """You are a professional AI personality design expert.

Output requirements:
1. Preserve core personality dimensions
2. Output format: Markdown, clearly structured
3. Do NOT output any explanatory text — output only the optimized config itself
4. Use `# AI_Name` as the first line of the Markdown title"""


def _build_user_prompt(answers: dict, base_config: str, lang: str) -> str:
    labels_zh = {
        "interaction": "互动方式", "style": "沟通风格", "feedback": "反馈方式",
        "task": "任务处理", "tone": "语气温度", "relation": "理想关系",
        "decision": "决策风格", "error": "错误处理", "depth": "分析深度",
        "creativity": "创意偏好", "pressure": "压力应对", "growth": "成长支持",
        "domain": "主要领域", "name_pref": "名字风格", "memory": "记忆机制",
        "boundary": "边界意识",
    }
    labels_en = {
        "interaction": "Interaction Style", "style": "Communication Style",
        "feedback": "Feedback Style", "task": "Task Handling",
        "tone": "Tone & Warmth", "relation": "Ideal Relationship",
        "decision": "Decision Style", "error": "Error Handling",
        "depth": "Analysis Depth", "creativity": "Creative Preference",
        "pressure": "Under Pressure", "growth": "Growth Support",
        "domain": "Primary Domain", "name_pref": "Name Style",
        "memory": "Memory System", "boundary": "Boundary Awareness",
    }
    labels = labels_zh if lang == "zh" else labels_en
    answer_lines = "\n".join(f"- **{labels.get(k, k)}**: `{v}`" for k, v in answers.items())
    return f"""请根据以下用户答题结果和基础配置，生成增强版的 AI 人格系统配置。

## 用户答题结果
{answer_lines}

## 规则矩阵生成的基础配置
```markdown
{base_config}
```

请深度优化这段配置，使其更有"灵魂"、更有"温度"、更有"智慧"、更有"个性"。
请直接输出优化后的完整配置（Markdown格式），不要添加任何前缀说明。"""


# ─── 非流式 ────────────────────────────────────────────────────────────────────

def enhance_persona(answers: dict, base_config: str, lang: str = "zh") -> tuple[str, str, dict]:
    model = pick_model()
    system_prompt = _build_system_prompt(lang)
    user_prompt = _build_user_prompt(answers, base_config, lang)

    if client is not None:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=8192,
            temperature=0.7,
        )
        content = response.choices[0].message.content
    else:
        # openai < 1.0 降级路径
        resp = _old_openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=8192,
            temperature=0.7,
        )
        content = resp.choices[0].message.content

    meta = parse_meta_from_markdown(content, lang)
    return content, model, meta


# ─── 流式 ─────────────────────────────────────────────────────────────────────

def enhance_persona_stream(answers: dict, base_config: str, lang: str = "zh"):
    model = pick_model()
    system_prompt = _build_system_prompt(lang)
    user_prompt = _build_user_prompt(answers, base_config, lang)

    yield "start", model

    full_text = ""

    if client is not None:
        stream = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=8192,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                full_text += delta
                yield "delta", delta
    else:
        stream = _old_openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=8192,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                full_text += delta
                yield "delta", delta

    meta = parse_meta_from_markdown(full_text, lang)
    yield "meta", json.dumps(meta, ensure_ascii=False)
    yield "done", ""
