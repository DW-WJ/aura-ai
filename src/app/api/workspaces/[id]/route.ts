import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWorkspaceContext, requireAdmin } from '@/lib/auth-workspace';

type Params = { params: Promise<{ id: string }> };

// GET /api/workspaces/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    if (ctx.workspaceId !== id) {
      return NextResponse.json({ error: '无权访问此工作空间' }, { status: 403 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        _count: { select: { configs: true, members: true } },
      },
    });

    if (!workspace) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      workspace: {
        ...workspace,
        role: ctx.role,
      },
    });
  } catch (error) {
    console.error('[Workspace GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[id] — 重命名（仅 owner/admin）
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    if (ctx.workspaceId !== id) {
      return NextResponse.json({ error: '无权访问此工作空间' }, { status: 403 });
    }

    const forbidden = await requireAdmin(ctx);
    if (forbidden instanceof NextResponse) return forbidden;

    const { name } = await request.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: '名称不能为空' }, { status: 400 });
    }

    const workspace = await prisma.workspace.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error('[Workspace PATCH]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[id] — 删除（仅 owner）
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    if (ctx.workspaceId !== id) {
      return NextResponse.json({ error: '无权访问此工作空间' }, { status: 403 });
    }

    const forbidden = await requireAdmin(ctx);
    if (forbidden instanceof NextResponse) return forbidden;

    // 检查是否最后一个成员（owner），如果是则删除工作空间
    await prisma.workspace.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Workspace DELETE]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
