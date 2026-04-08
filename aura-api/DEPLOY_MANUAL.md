# AURA 后端手动部署指南（无 PM2）

## 方式一：Systemd（推荐用于 Linux 服务器）

### 1. 创建服务用户

```bash
# 创建专用用户（可选）
useradd -m -s /bin/bash aura
```

### 2. 创建 Systemd 服务文件

```bash
sudo nano /etc/systemd/system/aura-api.service
```

写入以下内容：

```ini
[Unit]
Description=AURA Python API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/www/wwwroot/aura-api
Environment="PATH=/www/wwwroot/aura-api/venv/bin"
ExecStart=/www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py
Restart=always
RestartSec=5
StandardOutput=append:/www/wwwroot/aura-api/logs/stdout.log
StandardError=append:/www/wwwroot/aura-api/logs/stderr.log

[Install]
WantedBy=multi-user.target
```

### 3. 创建日志目录

```bash
mkdir -p /www/wwwroot/aura-api/logs
```

### 4. 启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable aura-api      # 开机自启
sudo systemctl start aura-api        # 启动
sudo systemctl status aura-api       # 查看状态
```

### 5. 常用命令

```bash
systemctl start aura-api     # 启动
systemctl stop aura-api      # 停止
systemctl restart aura-api    # 重启
systemctl status aura-api    # 状态
journalctl -u aura-api       # 查看日志
journalctl -u aura-api -f     # 实时日志
```

---

## 方式二：Supervisor（宝塔常用）

### 1. 安装 Supervisor

```bash
# CentOS
yum install supervisor

# Debian/Ubuntu
apt install supervisor
```

### 2. 创建配置

```bash
sudo nano /etc/supervisord.d/aura-api.ini
```

写入：

```ini
[program:aura-api]
command=/www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py
directory=/www/wwwroot/aura-api
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/www/wwwroot/aura-api/logs/aura-api.log
stderr_logfile=/www/wwwroot/aura-api/logs/aura-api-error.log
environment=PYTHONUNBUFFERED="1"
```

### 3. 创建日志目录并启动

```bash
mkdir -p /www/wwwroot/aura-api/logs

# 宝塔面板 → 软件商店 → Supervisor → 添加守护进程
# 或者命令行
supervisord -c /etc/supervisord.conf
supervisorctl reread
supervisorctl update
supervisorctl start aura-api
```

### 4. 常用命令

```bash
supervisorctl status aura-api     # 查看状态
supervisorctl start aura-api      # 启动
supervisorctl stop aura-api        # 停止
supervisorctl restart aura-api     # 重启
supervisorctl tail -f aura-api     # 查看日志
```

---

## 方式三：Nohup 后台运行（最简单）

### 1. 直接后台运行

```bash
cd /www/wwwroot/aura-api
source venv/bin/activate

# 后台运行
nohup python main.py > logs/stdout.log 2>&1 &

# 查看进程
ps aux | grep main.py

# 查看日志
tail -f logs/stdout.log
```

### 2. 停止服务

```bash
# 找到进程 ID
ps aux | grep main.py

# 杀死进程
kill <PID>
```

---

## 方式四：Screen 会话（适合调试）

### 1. 创建会话

```bash
# 安装 screen
yum install screen   # CentOS
apt install screen   # Debian/Ubuntu

# 创建名为 aura 的会话
screen -S aura

# 在会话中运行
cd /www/wwwroot/aura-api
source venv/bin/activate
python main.py
```

### 2. 分离会话（保持运行）

按 `Ctrl+A`，然后按 `D`

### 3. 恢复会话

```bash
screen -r aura
```

### 4. 常用命令

```bash
screen -ls              # 列出所有会话
screen -r aura           # 恢复 aura 会话
screen -X -S aura quit  # 删除会话
```

---

## 方式五：Docker（推荐用于生产环境）

### 1. 创建 Dockerfile

在 `/www/wwwroot/aura-api/` 创建 `Dockerfile`：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 运行
CMD ["python", "main.py"]
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  aura-api:
    build: .
    container_name: aura-api
    restart: always
    ports:
      - "8000:8000"
    environment:
      - LONGCAT_API_KEY=your_api_key_here
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3. 启动

```bash
cd /www/wwwroot/aura-api

# 构建并启动
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 4. Docker 常用命令

```bash
docker-compose up -d          # 后台启动
docker-compose logs -f          # 查看日志
docker-compose restart          # 重启
docker-compose down             # 停止
docker-compose down -v           # 停止并删除数据
docker-compose exec aura-api bash  # 进入容器
```

---

## 完整部署流程（任选一种）

### Step 1: 上传代码

```bash
# Git clone
cd /www/wwwroot
git clone https://github.com/DW-WJ/aura-ai.git aura-temp
mv aura-temp/aura-api /www/wwwroot/aura-api
rm -rf aura-temp
```

### Step 2: 创建虚拟环境

```bash
cd /www/wwwroot/aura-api
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 3: 配置环境变量

```bash
cat > /www/wwwroot/aura-api/.env << 'EOF'
LONGCAT_API_KEY=你的API密钥
EOF
```

### Step 4: 测试运行

```bash
source venv/bin/activate
python main.py
# 看到 Uvicorn running on http://0.0.0.0:8000 即成功
# 按 Ctrl+C 停止
```

### Step 5: 配置开机自启（任选一种方式）

**方式一：Systemd（推荐）**
```bash
sudo nano /etc/systemd/system/aura-api.service
# 写入上方 Systemd 配置内容
sudo systemctl daemon-reload
sudo systemctl enable aura-api
sudo systemctl start aura-api
```

**方式二：Supervisor**
```bash
sudo nano /etc/supervisord.d/aura-api.ini
# 写入上方 Supervisor 配置内容
supervisord -c /etc/supervisord.conf
supervisorctl start aura-api
```

**方式三：Docker**
```bash
cd /www/wwwroot/aura-api
docker-compose up -d
```

**方式四：Nohup**
```bash
mkdir -p /www/wwwroot/aura-api/logs
nohup /www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py > /www/wwwroot/aura-api/logs/stdout.log 2>&1 &
echo $! > /www/wwwroot/aura-api/aura-api.pid
```

**方式五：Screen**
```bash
screen -dmS aura /www/wwwroot/aura-api/venv/bin/python /www/wwwroot/aura-api/main.py
```

### Step 6: 验证

```bash
curl http://127.0.0.1:8000/health
# 返回 {"status":"ok"} 即成功
```

---

## 前端配置

部署完成后，修改前端环境变量：

```bash
# 编辑前端 .env
nano /www/wwwroot/aura-app/.env

# 添加
PYTHON_API_URL=http://127.0.0.1:8000
```

---

## 端口占用检查

```bash
# 查看 8000 端口占用
lsof -i :8000
netstat -tlnp | grep 8000
ss -tlnp | grep 8000

# 杀死占用进程
kill -9 <PID>
```
