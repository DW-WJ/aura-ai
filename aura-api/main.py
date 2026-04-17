"""
AURA AI Enhancement API - 支持流式输出 SSE + 元数据
"""

import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Literal, Iterator

from longcat_client import enhance_persona, enhance_persona_stream, MODEL_POOL, pick_model, client, MAX_RETRIES

app = FastAPI(title="AURA AI Enhancement API", version="1.4.0")

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


class SBTIInterpretRequest(BaseModel):
    prompt: str
    lang: str = "zh"


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
                yield sse("meta", value)
            elif label == "delta":
                yield sse("delta", json.dumps({"content": value}))
            elif label == "done":
                yield sse("done", "")
    except Exception as e:
        yield sse("error", str(e))


def sbti_stream_generator(prompt: str, lang: str) -> Iterator[bytes]:
    """Generate SSE stream for SBTI interpretation"""
    tried = set()
    for attempt in range(MAX_RETRIES + 1):
        model = pick_model(exclude=tried)
        tried.add(model)
        system_msg = "你是一个幽默毒舌的SBTI人格分析师。你的解读风格：1. 像朋友吐槽一样自然，不一本正经；2. 带点网络梗和自嘲；3. 200-300字左右；4. 分点要有但不要太正式；5. 最后要给一句扎心的人生建议。"

        try:
            if client is not None:
                stream = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": prompt},
                    ],
                    max_tokens=1024,
                    temperature=0.8,
                    stream=True,
                )
            else:
                yield sse("error", "OpenAI client not available")
                return

            yield sse("start", model)

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    delta = chunk.choices[0].delta.content
                    yield sse("delta", json.dumps({"content": delta}))

            yield sse("done", "")
            return

        except Exception as e:
            if attempt == MAX_RETRIES:
                yield sse("error", str(e))
                return


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


@app.post("/sbti-interpret")
async def sbti_interpret(req: SBTIInterpretRequest):
    if not req.prompt:
        raise HTTPException(status_code=400, detail="prompt 不能为空")
    return StreamingResponse(
        sbti_stream_generator(req.prompt, req.lang),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
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
