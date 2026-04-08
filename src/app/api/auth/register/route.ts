import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: '密码至少 8 位' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('[Register]', error);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}
