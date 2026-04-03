# AURA API — AI 增强服务

基于 LongCat 大模型，对 AURA 答题结果进行深度优化，生成更有灵魂的 AI 人格配置。

## 环境准备

```bash
cd aura-api
cp .env.example .env
# 编辑 .env，填入你的 LongCat API Key
```

获取 API Key: https://longcat.chat/platform/api_keys

## 安装依赖

```bash
pip install -r requirements.txt
```

## 启动服务

```bash
python main.py
# 监听 http://127.0.0.1:8000
```

可选参数：
```bash
# 指定端口
uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

## API 文档

启动后访问 http://127.0.0.1:8000/docs 查看 FastAPI 自动生成的交互式文档。

## 接口说明

### POST /enhance

生成增强版 AI 人格配置。

**请求体：**
```json
{
  "answers": {
    "interaction": "proactive",
    "style": "concise",
    "feedback": "direct",
    "task": "agile",
    "tone": "professional",
    "relation": "assistant",
    "decision": "decisive",
    "error": "direct_fix",
    "depth": "practical",
    "creativity": "bold",
    "pressure": "solution",
    "growth": "challenge",
    "domain": "productivity",
    "name_pref": "modern",
    "memory": "full",
    "boundary": "transparent"
  },
  "base_config": "...",
  "lang": "zh"
}
```

**响应：**
```json
{
  "enhanced_config": "## 角色定义\n\n...",
  "model": "LongCat-Flash-Thinking-2601"
}
```

### GET /health

健康检查，返回 `{ "status": "ok" }`。

## 前端联调

前端默认通过 Next.js API Route (`/api/enhance`) 代理到 Python 服务。

前端需确保 Python 服务已启动，或修改环境变量指向实际地址：

```bash
# .env.local（前端根目录）
PYTHON_API_URL=http://127.0.0.1:8000
```

## 生产部署建议

- **Nginx 代理**：将 `/api/enhance` 转发到 Python 服务，避免前端跨域
- **环境变量**：API Key 不要提交到代码仓库，通过环境变量注入
- **限流**：LongCat 有每日免费额度，生产环境建议加上请求频率限制
