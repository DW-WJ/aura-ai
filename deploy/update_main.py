#!/usr/bin/env python3
import sys
import os

code = '''
from pydantic import BaseModel

class SBTIInterpretRequest(BaseModel):
    prompt: str
    lang: str = "zh"

async def _sbti_stream_events(prompt, lang):
    model_name, model = _select_model()
    yield "event: start\\ndata: " + model_name + "\\n\\n"
    try:
        async for chunk in longcat_client.chat_stream(model, [
            {"role": "system", "content": "你是一个幽默毒舌的SBTI人格分析师。你的解读风格：1. 像朋友吐槽一样自然，不一本正经；2. 带点网络梗和自嘲；3. 200-300字左右；4. 分点要有但不要太正式；5. 最后要给一句扎心的人生建议。"},
            {"role": "user", "content": prompt},
        ], lang):
            if chunk:
                safe = chunk.replace("\\\\", "\\\\\\\\").replace('"', '\\\\"').replace("\\n", "\\\\n")
                yield "event: delta\\ndata: {\\"content\\": \\"" + safe + "\\"}\\n\\n"
        yield "event: done\\ndata: \\n\\n"
    except Exception as e:
        yield "event: error\\ndata: " + str(e) + "\\n\\n"

@app.post("/sbti-interpret")
async def sbti_interpret(req: SBTIInterpretRequest):
    from fastapi.responses import StreamingResponse
    from fastapi import HTTPException
    if not req.prompt:
        raise HTTPException(status_code=400, detail="prompt cannot be empty")
    return StreamingResponse(
        _sbti_stream_events(req.prompt, req.lang),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
'''

path = sys.argv[1] if len(sys.argv) > 1 else '/www/wwwroot/aura-app/aura-api/main.py'

with open(path, 'r') as f:
    content = f.read()

# Remove old SBTI code
marker = '# SBTI AI'
idx = content.rfind(marker)
if idx >= 0:
    content = content[:idx]
    print('Removed old SBTI code')

with open(path, 'w') as f:
    f.write(content + '\n' + code)
print('Code appended')

# Verify
import ast
with open(path, 'r') as f:
    src = f.read()
ast.parse(src)
print('Syntax OK')
