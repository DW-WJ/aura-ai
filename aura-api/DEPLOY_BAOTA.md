# AURA 后端部署指南（宝塔面板）

## 概述

后端 `aura-api` 是 Python FastAPI 服务，提供 AI 增强功能（SSE 流式输出）。

- 端口：`8000`
- 健康检查：`GET /health`
- API 文档：`GET /docs`

---

## 一、上传代码

### 方式 1：Git clone（推荐）

```bash
cd /www/wwwroot
git clone https://github.com/DW-WJ/aura-ai.git aura-api-temp
mv aura-api-temp/aura-api /www/wwwroot/aura-api
rm -rf aura-api-temp
```

### 方式 2：直接上传

将 `aura-app/aura-api` 文件夹上传到服务器 `/www/wwwroot/aura-api`

---

## 二、配置环境

```bash
cd /www/wwwroot/aura-api

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

---

## 三、配置环境变量

创建 `/www/wwwroot/aura-api/.env` 文件：

```bash
# LongCat API Key（必填）
# 从 https://longcat.chat/platform/api_keys 获取
LONGCAT_API_KEY=your_api_key_here
```

---

## 四、测试运行

```bash
cd /www/wwwroot/aura-api
source venv/bin/activate

# 测试启动
python main.py

# 看到以下输出表示成功：
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

按 `Ctrl+C` 停止测试。

---

## 五、配置 PM2

### 方法 1：命令行（推荐）

```bash
cd /www/wwwroot/aura-api
source venv/bin/activate

# 安装 pm2（如果还没装）
npm install -g pm2

# 启动服务
pm2 start python --name aura-api -- /www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py

# 保存启动项
pm2 save

# 设置开机自启
pm2 startup
```

### 方法 2：宝塔面板 UI

1. 打开宝塔 → 软件商店 → PM2管理器
2. 点击"添加项目"：
   - 项目名称：`aura-api`
   - 项目目录：`/www/wwwroot/aura-api`
   - 启动命令：`/www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py`

---

## 六、验证部署

访问以下地址确认服务正常运行：

```
http://你的服务器IP:8000/health
```

返回 `{"status":"ok"}` 表示成功。

API 文档：
```
http://你的服务器IP:8000/docs
```

---

## 七、配置 Nginx 反向代理（可选）

如果希望通过域名访问后端 API：

1. 宝塔 → 网站 → 添加站点
2. 绑定子域名，如 `api.your-domain.com`
3. 设置 → 反向代理 → 添加：
   - 代理名称：`aura-api`
   - 目标 URL：`http://127.0.0.1:8000`
   - 发送域名：`$host`

或手动配置 Nginx：

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
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

## 八、配置 SSL（可选）

在宝塔面板 → 网站 → 设置 → SSL 中申请 Let's Encrypt 证书。

---

## 九、配置防火墙

确保服务器防火墙开放端口 `8000`：

```bash
# 开放端口
firewall-cmd --permanent --add-port=8000/tcp
firewall-cmd --reload

# 或者使用 iptables
iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
```

---

## 十、常用命令

```bash
# 查看状态
pm2 status aura-api

# 查看日志
pm2 logs aura-api

# 重启
pm2 restart aura-api

# 停止
pm2 stop aura-api

# 删除
pm2 delete aura-api
```

---

## 十一、前端配置

部署完成后，修改前端的 `PYTHON_API_URL` 环境变量：

**宝塔面板方式：**

1. 编辑 `/www/wwwroot/aura-app/.env`（前端项目目录）
2. 添加：
   ```
   PYTHON_API_URL=http://127.0.0.1:8000
   ```

**或 Nginx 反向代理方式：**

如果通过 Nginx 将后端暴露为子域名，前端配置：
```
PYTHON_API_URL=https://api.your-domain.com
```

---

## 十二、目录结构

```
/www/wwwroot/
├── aura-api/              # Python 后端
│   ├── venv/               # Python 虚拟环境
│   ├── main.py             # FastAPI 入口
│   ├── longcat_client.py   # LongCat API 客户端
│   ├── requirements.txt     # Python 依赖
│   ├── .env                # 环境变量（包含 LONGCAT_API_KEY）
│   └── README.md
└── aura-app/              # Next.js 前端（可选，如果在同一台服务器）
```

---

## 十三、常见问题

**1. `pm2 start` 报错找不到 python**

使用完整路径：
```bash
pm2 start /www/wwwroot/aura-api/venv/bin/python --name aura-api -- /www/wwwroot/aura-api/main.py
```

**2. API 返回 500 错误**

检查日志：
```bash
pm2 logs aura-api
```

常见原因：`LONGCAT_API_KEY` 未配置或无效。

**3. 前端无法连接后端**

确保防火墙开放 8000 端口，或使用 Nginx 反向代理。

**4. Python 依赖安装失败**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**5. 内存不足**

创建 2GB 交换文件：
```bash
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

---

## 十四、一键部署脚本

```bash
#!/bin/bash
set -e

API_DIR="/www/wwwroot/aura-api"

# 1. 创建目录
mkdir -p $API_DIR

# 2. 上传代码后进入目录
cd $API_DIR

# 3. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 4. 安装依赖
pip install --upgrade pip
pip install -r requirements.txt

# 5. PM2 启动
pm2 start python --name aura-api -- $API_DIR/venv/bin/python $API_DIR/main.py
pm2 save
pm2 startup

echo "✅ AURA 后端部署完成！"
echo "访问 http://127.0.0.1:8000/health 检查状态"
```
