import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getWorkspaceContext, generateUniqueSlug } from '@/lib/auth-workspace';

// GET /api/workspaces — 获取当前用户所有工作空间
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: {
        workspace: {
          include: {
            _count: { select: { configs: true, members: true } },
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    const workspaces = memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      plan: m.workspace.plan,
      role: m.role,
      configCount: m.workspace._count.configs,
      memberCount: m.workspace._count.members,
      joinedAt: m.joinedAt,
      createdAt: m.workspace.createdAt,
    }));

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error('[Workspaces GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/workspaces — 创建新工作空间
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: '工作空间名称不能为空' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(name.trim());

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner',
          },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
      },
    });

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error('[Workspaces POST]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
