import { NextRequest } from 'next/server';

// 强制 Node.js Runtime（非 Edge），避免 SSE 缓冲问题
export const runtime = 'nodejs';

const PYTHON_API = process.env.PYTHON_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: '无效的请求体，请传入 JSON' }, { status: 400 });
  }

  let pythonRes: Response;
  try {
    pythonRes = await fetch(`${PYTHON_API}/enhance-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return Response.json(
      {
        error: '无法连接到 AI 增强服务。请确保 aura-api 已启动。',
        code: 'CONNECTION_ERROR',
      },
      { status: 503 }
    );
  }

  if (!pythonRes.ok) {
    let errDetail = '';
    try {
      const errJson = await pythonRes.json();
      errDetail = errJson?.detail ?? errJson?.error ?? '';
    } catch { /* ignore */ }
    const msg = errDetail
      ? `后端服务返回错误：${errDetail}`
      : `AI 增强服务暂时不可用（HTTP ${pythonRes.status}）`;
    return Response.json({ error: msg, code: 'UPSTREAM_ERROR' }, { status: 502 });
  }

  // 手动逐 chunk 读取 SSE 并转发，确保无缓冲
  const reader = pythonRes.body!.getReader();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        // ignore
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Transfer-Encoding': 'chunked',
    },
  });
}
