# 宝塔面板部署 AURA 指南

## 环境要求

- 宝塔面板 7.0+
- Node.js >= 18 (建议 20)
- PM2 管理器
- Nginx (可选，用于反向代理)

---

## 一、上传代码

1. **上传项目文件**
   - 将 `aura-app` 整个文件夹上传到服务器 `/www/wwwroot/aura-app`
   - 或者使用 Git clone：
     ```bash
     cd /www/wwwroot
     git clone https://github.com/DW-WJ/aura-ai.git aura-app
     cd aura-app
     ```

2. **安装依赖**
   ```bash
   cd /www/wwwroot/aura-app
   npm install
   ```

---

## 二、配置环境变量

在 `/www/wwwroot/aura-app` 目录下创建 `.env` 文件：

```bash
# 数据库 (SQLite 路径)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="生成一个随机字符串，如：openssl rand -base64 32"

# Google OAuth (可选)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""

# Python API (AI 增强)
PYTHON_API_URL="http://127.0.0.1:8000"
LONGCAT_API_KEY=""
```

生成 Secret：
```bash
openssl rand -base64 32
```

---

## 三、初始化数据库

```bash
cd /www/wwwroot/aura-app
npx prisma generate
npx prisma migrate deploy
```

---

## 四、配置 PM2

1. 打开宝塔面板 → 软件商店 → PM2管理器
2. 添加项目：
   - 项目目录：`/www/wwwroot/aura-app`
   - 启动文件：`npm`
   - 项目名称：`aura`
   - 运行参数：`run start`

或者命令行添加：
```bash
cd /www/wwwroot/aura-app
pm2 start npm --name aura -- run start
pm2 save
pm2 startup
```

---

## 五、配置 Nginx 反向代理（推荐）

1. 宝塔面板 → 网站 → 添加站点
2. 填写域名，PHP版本选择"纯静态"
3. 站点创建后，点击"设置" → "反向代理" → 添加反向代理：
   - 代理名称：`aura`
   - 目标URL：`http://127.0.0.1:3000`
   - 发送域名：`$host`

或者手动配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 六、SSL 证书（可选）

在宝塔面板 → 网站 → 设置 → SSL → Let's Encrypt 免费申请

---

## 七、常用命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs aura

# 重启
pm2 restart aura

# 停止
pm2 stop aura
```

---

## 八、Python 后端部署（AI 增强功能）

如果需要 AI 增强功能，还需要部署 `aura-api`：

1. 上传 `aura-api` 文件夹到 `/www/wwwroot/aura-api`
2. 创建虚拟环境：
   ```bash
   cd /www/wwwroot/aura-api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. 配置 `.env` 文件：
   ```bash
   LONGCAT_API_KEY="你的API密钥"
   ```
4. 用 PM2 管理：
   ```bash
   pm2 start python --name aura-api -- main.py
   pm2 save
   ```
5. 修改前端的 `PYTHON_API_URL`：
   ```
   PYTHON_API_URL=http://127.0.0.1:8000
   ```

---

## 九、目录结构

```
/www/wwwroot/
├── aura-app/          # Next.js 前端
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
└── aura-api/         # Python 后端 (可选)
    ├── main.py
    ├── .env
    └── requirements.txt
```

---

## 十、常见问题

**1. 500 错误**
- 检查 PM2 日志：`pm2 logs aura`
- 可能是 .env 配置错误

**2. 数据库错误**
- 确保 `prisma/dev.db` 文件存在
- 运行 `npx prisma migrate deploy`

**3. 静态资源加载失败**
- 确保 Node.js 版本 >= 18
- 尝试 `npm run build` 后重启

**4. OAuth 登录失败**
- 确保 Google OAuth 配置正确
- 检查回调 URL 是否在 Google Cloud Console 白名单
