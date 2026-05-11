import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWorkspaceContext, requireAdmin, requireOwner } from '@/lib/auth-workspace';

type Params = { params: Promise<{ id: string }> };

// GET /api/workspaces/[id]/members — 成员列表
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('[Members GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/workspaces/[id]/members — 邀请成员（仅 admin+）
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const forbidden = await requireAdmin(ctx);
    if (forbidden instanceof NextResponse) return forbidden;

    const { email, role = 'member' } = await request.json();
    if (!email) {
      return NextResponse.json({ error: '邮箱不能为空' }, { status: 400 });
    }

    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'role 只能是 admin 或 member' }, { status: 400 });
    }

    // 查找被邀请用户
    const invitee = await prisma.user.findUnique({ where: { email } });
    if (!invitee) {
      return NextResponse.json({ error: '该邮箱未注册，请先注册后再邀请' }, { status: 404 });
    }

    // 检查是否已是成员
    const existing = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: invitee.id } },
    });
    if (existing) {
      return NextResponse.json({ error: '该用户已是工作空间成员' }, { status: 409 });
    }

    const member = await prisma.workspaceMember.create({
      data: { workspaceId: id, userId: invitee.id, role },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('[Members POST]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[id]/members — 修改成员角色（仅 owner）
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const forbidden = await requireOwner(ctx);
    if (forbidden instanceof NextResponse) return forbidden;

    const { memberId, role } = await request.json();
    if (!memberId || !role) {
      return NextResponse.json({ error: 'memberId 和 role 必填' }, { status: 400 });
    }

    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'role 只能是 admin 或 member' }, { status: 400 });
    }

    // 不能修改 owner 自己
    const target = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: memberId } },
    });
    if (!target) return NextResponse.json({ error: '成员不存在' }, { status: 404 });
    if (target.role === 'owner') {
      return NextResponse.json({ error: '不能修改 owner 的角色' }, { status: 403 });
    }

    const updated = await prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId: id, userId: memberId } },
      data: { role },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });

    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error('[Members PATCH]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[id]/members — 移除成员（仅 admin+，owner 只能被删除工作空间时移除）
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ctx = await getWorkspaceContext(request);
    if (ctx instanceof NextResponse) return ctx;

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    if (!memberId) return NextResponse.json({ error: 'memberId 必填' }, { status: 400 });

    const target = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: memberId } },
    });
    if (!target) return NextResponse.json({ error: '成员不存在' }, { status: 404 });
    if (target.role === 'owner') {
      return NextResponse.json({ error: '不能移除 owner，请先删除工作空间' }, { status: 403 });
    }

    // 普通成员只能自行退出；admin 可以移除 member
    if (ctx.role === 'member' && memberId !== ctx.userId) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    await prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId: id, userId: memberId } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Members DELETE]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
