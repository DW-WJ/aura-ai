import { NextRequest } from 'next/server';

const PYTHON_API = process.env.PYTHON_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: '无效的请求体，请传入 JSON' }, { status: 400 });
  }

  try {
    const pythonRes = await fetch(`${PYTHON_API}/enhance-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!pythonRes.ok) {
      let errDetail = '';
      try {
        const errJson = await pythonRes.json();
        errDetail = errJson?.detail ?? errJson?.error ?? '';
      } catch { /* ignore */ }

      const msg = errDetail
        ? `后端服务返回错误：${errDetail}`
        : 'AI 增强服务暂时不可用（HTTP ' + pythonRes.status + '），请稍后重试';

      return Response.json(
        { error: msg, code: 'UPSTREAM_ERROR' },
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream directly through
    return new Response(pythonRes.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: unknown) {
    const isConnectError =
      err instanceof TypeError ||
      (err instanceof Error && err.message.includes('fetch'));

    const message = isConnectError
      ? '无法连接到 AI 增强服务。请确保 aura-api 已启动（运行 python main.py），或检查 .env.local 中的 PYTHON_API_URL 配置。'
      : (err instanceof Error ? err.message : String(err));

    return Response.json(
      {
        error: message,
        hint: isConnectError
          ? '提示：启动后端服务后刷新页面重试'
          : undefined,
        code: isConnectError ? 'CONNECTION_ERROR' : 'UNKNOWN_ERROR',
      },
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
