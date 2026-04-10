import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// 初始化管理员账号（仅首次部署时调用）
export async function POST(request: NextRequest) {
  try {
    // 检查是否已有用户
    const userCount = await prisma.user.count();

    // 如果已有用户，需要验证管理员权限
    if (userCount > 0) {
      const authHeader = request.headers.get('authorization');
      const adminKey = process.env.ADMIN_INIT_KEY;

      if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
        return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
      }
    }

    // 默认管理员信息
    const defaultAdmin = {
      email: 'admin@aura.local',
      name: 'Admin',
      password: 'Aura@2026Admin',
    };

    // 检查管理员是否已存在
    const existing = await prisma.user.findUnique({
      where: { email: defaultAdmin.email }
    });

    if (existing) {
      return NextResponse.json({
        message: '管理员账号已存在',
        email: defaultAdmin.email,
        note: '如需重置密码，请直接在数据库操作'
      });
    }

    // 创建管理员
    const passwordHash = await bcrypt.hash(defaultAdmin.password, 12);
    const admin = await prisma.user.create({
      data: {
        email: defaultAdmin.email,
        name: defaultAdmin.name,
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({
      success: true,
      message: '管理员账号创建成功',
      admin: {
        email: defaultAdmin.email,
        password: defaultAdmin.password,
        createdAt: admin.createdAt,
      },
      warning: '请立即记录密码并删除此 API 路由或设置 ADMIN_INIT_KEY 环境变量！'
    });

  } catch (error) {
    console.error('[Init Admin]', error);
    return NextResponse.json({ error: '初始化失败' }, { status: 500 });
  }
}
