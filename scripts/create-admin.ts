import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@aura.local';
  const password = 'admin123456';
  const name = 'Admin';

  // 检查是否已存在
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log('管理员账户已存在:');
    console.log('  邮箱:', email);
    console.log('  密码:', password);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  console.log('✅ 管理员账户创建成功!');
  console.log('');
  console.log('邮箱:', email);
  console.log('密码:', password);
  console.log('');
  console.log('请访问 http://localhost:3000/auth/signin 登录');
}

main()
  .catch((e) => {
    console.error('创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
