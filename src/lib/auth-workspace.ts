/**
 * Workspace context helper
 * 从请求头获取当前工作空间 ID，校验用户是否是成员
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

/**
 * 从请求头获取 workspaceId，默认取用户第一个工作空间
 */
export async function getWorkspaceId(request?: NextRequest, userId?: string): Promise<string | null> {
  const workspaceId = request?.headers.get('x-workspace-id');
  if (workspaceId) return workspaceId;

  // fallback：取用户最近加入的工作空间
  if (userId) {
    const member = await prisma.workspaceMember.findFirst({
      where: { userId },
      orderBy: { joinedAt: 'asc' },
      include: { workspace: { select: { id: true } } },
    });
    return member?.workspace.id ?? null;
  }
  return null;
}

/**
 * 校验用户对工作空间的访问权限
 * owner / admin / member 都可访问
 */
export async function getWorkspaceContext(
  request: NextRequest,
  userId?: string
): Promise<WorkspaceContext | NextResponse> {
  const session = await auth();
  const uid = userId ?? session?.user?.id;
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspaceId = await getWorkspaceId(request, uid);
  if (!workspaceId) {
    return NextResponse.json({ error: '请先选择一个工作空间' }, { status: 400 });
  }

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: uid } },
    include: { workspace: true },
  });

  if (!member) {
    return NextResponse.json({ error: '你不是该工作空间的成员' }, { status: 403 });
  }

  return {
    workspaceId,
    userId: uid,
    role: member.role as 'owner' | 'admin' | 'member',
    workspace: {
      id: member.workspace.id,
      name: member.workspace.name,
      slug: member.workspace.slug,
      plan: member.workspace.plan,
    },
  };
}

/**
 * 仅 owner / admin 可访问的校验
 */
export async function requireAdmin(ctx: WorkspaceContext): Promise<NextResponse | true> {
  if (ctx.role === 'member') {
    return NextResponse.json({ error: '权限不足，仅管理员可执行此操作' }, { status: 403 });
  }
  return true;
}

/**
 * 仅 owner 可访问的校验
 */
export async function requireOwner(ctx: WorkspaceContext): Promise<NextResponse | true> {
  if (ctx.role !== 'owner') {
    return NextResponse.json({ error: '权限不足，仅所有者可执行此操作' }, { status: 403 });
  }
  return true;
}

/**
 * 生成 slug（URL 友好，唯一性校验）
 */
export async function generateUniqueSlug(base: string): Promise<string> {
  let slug = base
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  // 避免重复
  let counter = 1;
  let unique = slug;
  while (true) {
    const existing = await prisma.workspace.findUnique({ where: { slug: unique } });
    if (!existing) break;
    unique = `${slug}-${counter++}`;
  }
  return unique;
}
