import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// PATCH /api/configs/[id] - 更新配置
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, configText, answersJson, statsJson, isPublic } = await request.json();

    // 检查配置归属
    const existing = await prisma.userConfig.findFirst({
      where: { id, userId: session.user.id },
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

// DELETE /api/configs/[id] - 删除配置
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 检查配置归属
    const existing = await prisma.userConfig.findFirst({
      where: { id, userId: session.user.id },
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
