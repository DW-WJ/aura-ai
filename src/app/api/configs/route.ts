import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getWorkspaceContext } from '@/lib/auth-workspace';

// GET /api/configs - 获取当前工作空间的配置
// Header: x-workspace-id 可选，默认取用户第一个工作空间
export async function GET(request: NextRequest) {
  try {
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const configs = await prisma.userConfig.findMany({
      where: { workspaceId: ctx.workspaceId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        statsJson: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ configs });
  } catch (error) {
    console.error('[Configs GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/configs - 在当前工作空间保存配置
// Header: x-workspace-id 可选
export async function POST(request: NextRequest) {
  try {
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const { name, configText, answersJson, statsJson, isPublic } = await request.json();

    if (!name || !configText) {
      return NextResponse.json({ error: 'name 和 configText 必填' }, { status: 400 });
    }

    // free 计划限制 20 个配置
    if (ctx.workspace.plan === 'free') {
      const count = await prisma.userConfig.count({
        where: { workspaceId: ctx.workspaceId },
      });
      if (count >= 20) {
        return NextResponse.json({ error: '免费版最多保存 20 个配置，请先删除旧的或升级专业版' }, { status: 429 });
      }
    }

    const config = await prisma.userConfig.create({
      data: {
        userId: ctx.userId,
        workspaceId: ctx.workspaceId,
        name,
        configText,
        answersJson: answersJson ? JSON.stringify(answersJson) : '{}',
        statsJson: statsJson ? JSON.stringify(statsJson) : '{}',
        isPublic: isPublic ?? false,
      },
    });

    return NextResponse.json({ success: true, config }, { status: 201 });
  } catch (error) {
    console.error('[Configs POST]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
