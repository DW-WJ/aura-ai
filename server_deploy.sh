#!/bin/bash
set -e
mkdir -p /www/wwwroot/aura-app/src/app/api/enhance
cp /tmp/route.ts /www/wwwroot/aura-app/src/app/api/enhance/route.ts
cd /www/wwwroot/aura-app
npm install
npm run build
pkill -f "python main.py" || true
pkill -f "next start" || true
cd /www/wwwroot/aura-app/aura-api
nohup ./venv/bin/python main.py > /www/wwwroot/aura-app/logs/backend.log 2>&1 &
sleep 2
curl -s http://127.0.0.1:8000/models | head -c 50
cd /www/wwwroot/aura-app
nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &
sleep 4
curl -s http://62.234.49.52/ | head -c 80
echo "DONE"
