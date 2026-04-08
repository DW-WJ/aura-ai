import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/analytics - 获取统计数据（需要管理员权限）
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // 简单权限检查：只有登录用户可以查看自己的统计
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, all
    
    let dateFilter: Date | undefined;
    const now = new Date();
    if (period === '7d') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 获取用户的分析数据
    const events = await prisma.analyticsEvent.findMany({
      where: {
        userId: session.user.id,
        ...(dateFilter ? { timestamp: { gte: dateFilter } } : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: 1000,
    });

    // 统计汇总
    const eventCounts = events.reduce((acc, e) => {
      acc[e.eventName] = (acc[e.eventName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 获取用户保存的配置数量
    const configCount = await prisma.userConfig.count({
      where: { userId: session.user.id },
    });

    // 最近的配置
    const recentConfigs = await prisma.userConfig.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        updatedAt: true,
        isPublic: true,
      },
    });

    return NextResponse.json({
      totalEvents: events.length,
      eventCounts,
      configCount,
      recentConfigs,
      period,
    });
  } catch (error) {
    console.error('[Analytics GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/analytics - 记录事件（公开，无需登录）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, properties, url, referrer } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName required' }, { status: 400 });
    }

    // 尝试获取用户 session（可能没有登录）
    let userId: string | null = null;
    try {
      const session = await auth();
      userId = session?.user?.id ?? null;
    } catch {
      // 未登录用户
    }

    // 创建事件记录
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventName,
        properties: properties ? JSON.stringify(properties) : null,
        url: url || null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics POST]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}