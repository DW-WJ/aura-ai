import { NextRequest } from 'next/server';
export const runtime = 'nodejs';

const PYTHON_API = process.env.PYTHON_API ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: '无效请求' }, { status: 400 });
  }

  // SBTI AI 解读 - 调用 /sbti-interpret 端点
  const prompt = body.prompt ?? `我的SBTI人格是「${body.personality?.name ?? '未知'}」，${body.personality?.description ?? ''}。请用幽默毒舌风格解读一下。`;

  let pythonRes: Response;
  try {
    pythonRes = await fetch(`${PYTHON_API}/sbti-interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        lang: body.lang ?? 'zh',
      }),
    });
  } catch {
    return Response.json({ error: 'AI服务暂时不可用，请确保 aura-api 已启动。' }, { status: 503 });
  }

  if (!pythonRes.ok) {
    return Response.json({ error: `AI服务错误 (${pythonRes.status})` }, { status: 502 });
  }

  // SSE 流式转发
  const reader = pythonRes.body!.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch { /* ignore */ } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() { reader.cancel(); },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Transfer-Encoding': 'chunked',
    },
  });
}
