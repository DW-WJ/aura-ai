import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/configs - 获取当前用户的所有配置
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = await prisma.userConfig.findMany({
      where: { userId: session.user.id },
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

// POST /api/configs - 保存新配置
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, configText, answersJson, statsJson, isPublic } = await request.json();

    if (!name || !configText) {
      return NextResponse.json({ error: 'name 和 configText 必填' }, { status: 400 });
    }

    // 限制每用户最多 20 个配置
    const count = await prisma.userConfig.count({
      where: { userId: session.user.id },
    });
    if (count >= 20) {
      return NextResponse.json({ error: '最多保存 20 个配置，请先删除旧的' }, { status: 429 });
    }

    const config = await prisma.userConfig.create({
      data: {
        userId: session.user.id,
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
