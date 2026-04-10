import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 记录页面访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'pageview': {
        const { fingerprint, visitorIp, path, referrer, userId } = data;

        await prisma.pageView.create({
          data: {
            fingerprint: fingerprint || '',
            visitorIp: visitorIp || '',
            path: path || '/',
            referrer: referrer || '',
            userId: userId || null,
          }
        });

        // 异步更新每日统计（不阻塞响应）
        updateDailyStats(path, fingerprint).catch(console.error);

        return NextResponse.json({ success: true });
      }

      case 'session_start': {
        const { sessionId, fingerprint, visitorIp, firstPath, userId } = data;

        await prisma.visitSession.create({
          data: {
            id: sessionId,
            fingerprint: fingerprint || '',
            visitorIp: visitorIp || '',
            firstPath: firstPath || '/',
            lastPath: firstPath || '/',
            userId: userId || null,
          }
        });

        return NextResponse.json({ success: true });
      }

      case 'session_update': {
        const { sessionId, lastPath, pageCount, duration } = data;

        await prisma.visitSession.update({
          where: { id: sessionId },
          data: { lastPath, pageCount, duration }
        });

        return NextResponse.json({ success: true });
      }

      case 'quiz_start': {
        const { sessionId } = data;

        // 更新每日统计中的 quizStarted
        await incrementDailyStat('quizStarted');

        return NextResponse.json({ success: true });
      }

      case 'quiz_complete': {
        const { sessionId } = data;

        // 标记会话完成
        if (sessionId) {
          await prisma.visitSession.update({
            where: { id: sessionId },
            data: { completed: true }
          }).catch(() => {});
        }

        // 更新每日统计
        await incrementDailyStat('quizCompleted');

        return NextResponse.json({ success: true });
      }

      case 'ai_enhance': {
        const { userId, fingerprint, model, duration, status, errorMsg } = data;

        await prisma.apiLog.create({
          data: {
            userId: userId || null,
            fingerprint: fingerprint || '',
            endpoint: '/api/enhance',
            model: model || '',
            duration: duration || 0,
            status: status || 200,
            errorMsg: errorMsg || '',
          }
        });

        // 更新每日统计
        await incrementDailyStat('aiEnhanced');

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Analytics]', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}

// 获取统计数据（管理员）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d'; // 7d, 30d, all

    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
    }

    // 总体统计
    const [totalPV, totalUV, totalSessions, totalQuizCompleted, totalAiEnhanced] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: startDate } } }),
      prisma.pageView.groupBy({
        by: ['fingerprint'],
        where: { createdAt: { gte: startDate }, fingerprint: { not: '' } },
        _count: true,
      }).then(r => r.length),
      prisma.visitSession.count({ where: { createdAt: { gte: startDate } } }),
      prisma.visitSession.count({ where: { createdAt: { gte: startDate }, completed: true } }),
      prisma.apiLog.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    // 每日趋势
    const dailyStats = await prisma.dailyStats.findMany({
      where: { date: { gte: startDate }, path: '' },
      orderBy: { date: 'asc' },
      take: 30,
    });

    // 热门页面
    const topPages = await prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: startDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    // API 调用统计
    const apiStats = await prisma.apiLog.groupBy({
      by: ['status'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // 最近访问
    const recentVisits = await prisma.pageView.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        path: true,
        fingerprint: true,
        createdAt: true,
        duration: true,
      }
    });

    return NextResponse.json({
      summary: {
        totalPV,
        totalUV,
        totalSessions,
        totalQuizCompleted,
        totalAiEnhanced,
        conversionRate: totalSessions > 0 ? ((totalQuizCompleted / totalSessions) * 100).toFixed(1) : 0,
      },
      dailyStats,
      topPages: topPages.map(p => ({ path: p.path, count: p._count.path })),
      apiStats,
      recentVisits,
    });

  } catch (error) {
    console.error('[Analytics GET]', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// 辅助函数：获取今日日期（UTC 0点）
function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// 辅助函数：安全更新每日统计
async function incrementDailyStat(field: 'pv' | 'uv' | 'quizStarted' | 'quizCompleted' | 'aiEnhanced') {
  const today = getToday();
  
  try {
    // 先尝试查找现有记录
    const existing = await prisma.dailyStats.findUnique({
      where: { date_path: { date: today, path: '' } }
    });
    
    if (existing) {
      // 更新现有记录
      await prisma.dailyStats.update({
        where: { id: existing.id },
        data: { [field]: { increment: 1 } }
      });
    } else {
      // 创建新记录
      await prisma.dailyStats.create({
        data: { date: today, path: '', [field]: 1 }
      });
    }
  } catch (error) {
    // 静默失败，不影响主流程
    console.error('[Analytics] DailyStats update failed:', error);
  }
}

// 辅助函数：更新每日统计
async function updateDailyStats(path: string, fingerprint: string) {
  const today = getToday();

  // 更新全站统计
  await incrementDailyStat('pv');

  // 更新页面统计
  if (path && path !== '/') {
    try {
      const existing = await prisma.dailyStats.findUnique({
        where: { date_path: { date: today, path } }
      });
      
      if (existing) {
        await prisma.dailyStats.update({
          where: { id: existing.id },
          data: { pv: { increment: 1 } }
        });
      } else {
        await prisma.dailyStats.create({
          data: { date: today, path, pv: 1 }
        });
      }
    } catch (error) {
      console.error('[Analytics] Page stats update failed:', error);
    }
  }

  // UV 需要去重，这里简化处理（实际应该用 Redis 或定时任务）
}
