const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd, timeout=20000) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}

const API_DIR = '/www/wwwroot/aura-app/aura-api';

console.log('=== 1. 启动后端 (用venv的python) ===');
run(`pkill -f "python main.py" || true`);
run(`mkdir -p ${API_DIR}/logs`);
run(`cd ${API_DIR} && nohup ./venv/bin/python main.py > ${API_DIR}/logs/stdout.log 2>&1 &`);
console.log(run(`sleep 2 && curl -s http://127.0.0.1:8000/models`));

console.log('=== 2. 修复 Nginx API 代理 ===');
// Check what the current Nginx API location does
console.log('=== Check current /api/ location ===');
console.log(run(`curl -v http://62.234.49.52/api/models 2>&1 | head -20`));

// Write proper nginx config with correct API proxy
const nginxConf = `server {
    listen 80;
    server_name 62.234.49.52;
    root /www/wwwroot/aura-app/.next/server/app;
    index index.html;

    location /_next/ {
        alias /www/wwwroot/aura-app/.next/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
    }

    location / {
        try_files /index.html =404;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}`;

console.log('=== Write new nginx config ===');
run(`cat > /www/server/panel/vhost/nginx/aura.conf << 'NGINXCONF'\n${nginxConf}\nNGINXCONF`);
console.log('=== Test nginx ===');
console.log(run('nginx -t'));
console.log('=== Reload nginx ===');
console.log(run('nginx -s reload'));

console.log('=== 3. 验证 ===');
console.log('前端: ' + run('curl -s http://62.234.49.52/ | head -c 80'));
console.log('后端: ' + run('curl -s http://127.0.0.1:8000/models'));
console.log('API: ' + run('curl -s http://62.234.49.52/api/models'));
