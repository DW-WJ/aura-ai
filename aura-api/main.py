"""
AURA AI Enhancement API - 支持流式输出 SSE + 元数据
"""

import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Literal, Iterator

from longcat_client import enhance_persona, enhance_persona_stream, MODEL_POOL

app = FastAPI(title="AURA AI Enhancement API", version="1.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Models ───────────────────────────────────────────────────────────────────

class EnhanceRequest(BaseModel):
    answers: dict[str, str]
    base_config: str
    lang: Literal["zh", "en"] = "zh"


# ─── SSE 工具 ─────────────────────────────────────────────────────────────────

def sse(event: str, data: str) -> bytes:
    return f"event: {event}\ndata: {data}\n\n".encode()


# ─── SSE Generator ────────────────────────────────────────────────────────────

def event_generator(
    answers: dict[str, str],
    base_config: str,
    lang: str,
) -> Iterator[bytes]:
    try:
        for label, value in enhance_persona_stream(answers, base_config, lang):
            if label == "start":
                yield sse("start", value)
            elif label == "meta":
                # 元数据（名字/描述/性格标签），value 已经是 JSON 字符串
                yield sse("meta", value)
            elif label == "delta":
                yield sse("delta", json.dumps({"content": value}))
            elif label == "done":
                yield sse("done", "")
    except Exception as e:
        yield sse("error", str(e))


# ─── 流式路由 ─────────────────────────────────────────────────────────────────

@app.post("/enhance-stream")
async def enhance_stream(req: EnhanceRequest):
    if not req.answers:
        raise HTTPException(status_code=400, detail="answers 不能为空")

    return StreamingResponse(
        event_generator(req.answers, req.base_config, req.lang),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ─── 非流式路由（备用）─────────────────────────────────────────────────────────

@app.post("/enhance")
async def enhance_sync(req: EnhanceRequest):
    if not req.answers:
        raise HTTPException(status_code=400, detail="answers 不能为空")
    try:
        enhanced, model, meta = enhance_persona(req.answers, req.base_config, req.lang)
        return {"enhanced_config": enhanced, "model": model, "meta": meta}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LongCat API 调用失败: {e}")


# ─── 工具路由 ─────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/models")
async def models():
    return {"pool": [{"model": m, "weight": w} for m, w in MODEL_POOL]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
