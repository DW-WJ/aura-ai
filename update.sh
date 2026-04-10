#!/bin/bash
# AURA 自动更新脚本 (v2 - 修复版)
# 修复: pkill + set -e 导致脚本中断；添加 .next 缓存清理
#
# 使用方法：
#   bash update.sh              # 标准更新
#   bash update.sh --force      # 强制更新（丢弃本地修改）
#   bash update.sh --frontend   # 只更新前端
#   bash update.sh --backend    # 只更新后端

APP_DIR="/www/wwwroot/aura-app"
API_DIR="$APP_DIR/aura-api"
LOG_DIR="$APP_DIR/logs"
LOG_FRONTEND="$LOG_DIR/nextjs.log"
LOG_BACKEND="$LOG_DIR/backend.log"
LOG_UPDATE="$LOG_DIR/update.log"
NOW=$(date '+%Y-%m-%d %H:%M:%S')

# ─── 颜色 ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[$NOW]${NC} $1"; }
ok()   { echo -e "${GREEN}[$NOW] ✓${NC} $1"; }
err()  { echo -e "${RED}[$NOW] ✗${NC} $1"; }
warn() { echo -e "${YELLOW}[$NOW] ⚠${NC} $1"; }

# ─── 解析参数 ────────────────────────────────────────────────────────────────
MODE="full"
FORCE=false
STASHED=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force)    FORCE=true; shift ;;
        --frontend) MODE="frontend"; shift ;;
        --backend)  MODE="backend"; shift ;;
        *)          echo "未知参数: $1"; exit 1 ;;
    esac
done

# ─── 前置检查 ────────────────────────────────────────────────────────────────
log "========== AURA 自动更新开始 =========="
log "模式: $MODE | 强制: $FORCE"

mkdir -p "$LOG_DIR"

# ─── Git pull ────────────────────────────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    log ">>> [1/7] Git pull 拉取最新代码..."
    cd "$APP_DIR"

    if [[ "$FORCE" == "true" ]]; then
        git fetch --all
        git reset --hard origin/main
        ok "强制重置到远程最新"
    else
        if [[ -n "$(git status --porcelain)" ]]; then
            warn "有未提交的更改，将 stash..."
            git stash
            STASHED=true
        fi
        git pull origin main 2>&1 | tee -a "$LOG_UPDATE"
        if [[ "$STASHED" == "true" ]]; then
            warn "恢复 stash 的更改..."
            git stash pop || true
        fi
    fi
    ok "代码已更新"
fi

# ─── 安装前端依赖 ───────────────────────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    log ">>> [2/7] 安装前端依赖..."
    cd "$APP_DIR"
    npm install 2>&1 | tail -3
    ok "前端依赖安装完成"
fi

# ─── 安装后端依赖 ───────────────────────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "backend" ]]; then
    log ">>> [3/7] 安装后端依赖..."
    cd "$API_DIR"
    python3 -m pip install -r requirements.txt -q 2>&1 | tail -3
    ok "后端依赖安装完成"
fi

# ─── 清理构建缓存 ────────────────────────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    log ">>> [4/7] 清理 .next 缓存..."
    cd "$APP_DIR"
    rm -rf .next
    ok "缓存已清理"
fi

# ─── 构建前端 ────────────────────────────────────────────────────────────────
if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    log ">>> [5/7] 构建前端（全新构建）..."
    cd "$APP_DIR"
    if npm run build 2>&1 | tee -a "$LOG_UPDATE"; then
        ok "前端构建成功"
    else
        err "前端构建失败！查看日志: $LOG_UPDATE"
        exit 1
    fi
fi

# ─── 停止旧服务 ──────────────────────────────────────────────────────────────
log ">>> [6/7] 停止旧服务..."

if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    pkill -f "next-server" 2>/dev/null || true
    pkill -f "next start" 2>/dev/null || true
    sleep 2
    # 确认端口已释放
    if fuser 3000/tcp 2>/dev/null; then
        warn "端口 3000 仍被占用，强制杀掉"
        fuser -k 3000/tcp 2>/dev/null || true
        sleep 1
    fi
    ok "前端已停止"
fi

if [[ "$MODE" == "full" || "$MODE" == "backend" ]]; then
    pkill -f "python main.py" 2>/dev/null || true
    pkill -f "uvicorn" 2>/dev/null || true
    sleep 1
    ok "后端已停止"
fi

sleep 1

# ─── 启动新服务 ─────────────────────────────────────────────────────────────
log ">>> [7/7] 启动新服务..."

if [[ "$MODE" == "full" || "$MODE" == "backend" ]]; then
    log "启动后端..."
    cd "$API_DIR"
    nohup ./venv/bin/python main.py >> "$LOG_BACKEND" 2>&1 &
    BACKEND_PID=$!
    sleep 3
    if curl -sf http://127.0.0.1:8000/models > /dev/null 2>&1; then
        ok "后端已启动 (PID: $BACKEND_PID)"
    else
        err "后端启动失败！查看日志: $LOG_BACKEND"
        tail -10 "$LOG_BACKEND"
    fi
fi

if [[ "$MODE" == "full" || "$MODE" == "frontend" ]]; then
    log "启动前端..."
    cd "$APP_DIR"
    nohup npm run start >> "$LOG_FRONTEND" 2>&1 &
    FRONTEND_PID=$!
    sleep 6
    if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
        ok "前端已启动 (PID: $FRONTEND_PID)"
    else
        err "前端启动失败！查看日志: $LOG_FRONTEND"
        tail -10 "$LOG_FRONTEND"
    fi
fi

# ─── Nginx 重载 ─────────────────────────────────────────────────────────────
log "重载 Nginx..."
nginx -s reload 2>/dev/null && ok "Nginx 已重载" || warn "Nginx 重载失败"

# ─── 最终验证 ───────────────────────────────────────────────────────────────
sleep 2
log "========== 验证服务状态 =========="

STATUS=0

echo -n "  前端 (3000):   "
if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    ok "运行中"
else
    err "未运行"
    STATUS=1
fi

echo -n "  后端 (8000):   "
if curl -sf http://127.0.0.1:8000/models > /dev/null 2>&1; then
    ok "运行中"
else
    err "未运行"
    STATUS=1
fi

echo -n "  网站:           "
if curl -sf http://62.234.49.52/ > /dev/null 2>&1; then
    ok "正常访问"
else
    err "无法访问"
    STATUS=1
fi

echo ""
log "========== 更新完成 =========="
log "前端日志: $LOG_FRONTEND"
log "后端日志: $LOG_BACKEND"
log "更新日志: $LOG_UPDATE"
log "================================"

exit $STATUS
