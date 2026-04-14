#!/bin/bash
cd /www/wwwroot/aura-app
echo "=== Building NBTI ==="
npm run build
echo "=== Build complete ==="
echo "=== Restarting Next.js ==="
pm2 restart aura-app || (pkill -f "next start" || true; nohup /www/wwwroot/aura-app/aura-api/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/aura-api.log 2>&1 &; nohup npm start > /dev/null 2>&1 &)
echo "=== Done ==="
