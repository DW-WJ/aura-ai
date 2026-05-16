import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/share/[id] - Public share endpoint (no auth required)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const config = await prisma.userConfig.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        configText: true,
        statsJson: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!config || !config.isPublic) {
      return NextResponse.json({ error: '配置不存在或未公开' }, { status: 404 });
    }

    let statsJson = {};
    try { statsJson = JSON.parse(config.statsJson || '{}'); } catch {}

    return NextResponse.json({
      config: {
        ...config,
        statsJson,
      },
    });
  } catch (error) {
    console.error('[Share GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
