import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/auth/change-password
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少 6 位' }, { status: 400 });
    }

    // Check if user has a password (might be OAuth only)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // If user has no password (OAuth only), just set new one
    if (user.passwordHash) {
      const valid = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
      }
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ChangePassword]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
