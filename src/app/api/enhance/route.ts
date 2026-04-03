import { NextRequest } from 'next/server';

const PYTHON_API = process.env.PYTHON_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const pythonRes = await fetch(`${PYTHON_API}/enhance-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!pythonRes.ok) {
      const err = await pythonRes.json().catch(() => ({}));
      return new Response(JSON.stringify(err), {
        status: pythonRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 直接返回 Python 服务的 Response，Next.js 会透传流
    return new Response(pythonRes.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: '无法连接到 AI 增强服务，请确保 aura-api 已启动（python main.py）' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
