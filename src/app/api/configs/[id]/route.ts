import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWorkspaceContext } from '@/lib/auth-workspace';

// GET /api/configs/[id] - 获取单个配置详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const { id } = await params;

    const config = await prisma.userConfig.findFirst({
      where: { id, workspaceId: ctx.workspaceId },
    });

    if (!config) {
      return NextResponse.json({ error: '配置不存在或无权限' }, { status: 404 });
    }

    // Parse JSON fields
    let statsJson = {};
    let answersJson = {};
    try { statsJson = JSON.parse(config.statsJson || '{}'); } catch {}
    try { answersJson = JSON.parse(config.answersJson || '{}'); } catch {}

    return NextResponse.json({
      config: {
        ...config,
        statsJson,
        answersJson,
      },
    });
  } catch (error) {
    console.error('[Config GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/configs/[id] - 更新配置（workspace 隔离）
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const { id } = await params;
    const { name, configText, answersJson, statsJson, isPublic } = await request.json();

    const existing = await prisma.userConfig.findFirst({
      where: { id, workspaceId: ctx.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: '配置不存在或无权限' }, { status: 404 });
    }

    const config = await prisma.userConfig.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(configText && { configText }),
        ...(answersJson && { answersJson: JSON.stringify(answersJson) }),
        ...(statsJson && { statsJson: JSON.stringify(statsJson) }),
        ...(typeof isPublic === 'boolean' && { isPublic }),
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('[Config PATCH]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/configs/[id] - 删除配置（workspace 隔离）
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const { id } = await params;

    const existing = await prisma.userConfig.findFirst({
      where: { id, workspaceId: ctx.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: '配置不存在或无权限' }, { status: 404 });
    }

    await prisma.userConfig.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Config DELETE]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
