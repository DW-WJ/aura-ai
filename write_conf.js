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
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_cache_bypass \\$http_upgrade;
        proxy_read_timeout 300s;
    }
    location / {
        try_files /index.html =404;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}`;

console.log('=== Write nginx config via node on server ===');
// Use node on the server to write the file (avoids shell escaping issues)
const nodeScript = `
const fs = require('fs');
const conf = \`${nginxConf}\`;
fs.writeFileSync('/www/server/panel/vhost/nginx/aura.conf', conf);
console.log('Written ' + conf.length + ' bytes');
`;
run(`node -e "${nodeScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);

console.log('=== Clean up duplicate ===');
run('rm -f /www/server/nginx/conf/vhost/aura.conf');

console.log('=== Verify config ===');
console.log(run('cat /www/server/panel/vhost/nginx/aura.conf'));

console.log('=== Test nginx ===');
console.log(run('nginx -t'));

console.log('=== Reload nginx ===');
console.log(run('nginx -s reload'));

console.log('=== Test ===');
console.log('前端: ' + run('curl -s http://62.234.49.52/ | head -c 100'));
console.log('API: ' + run('curl -s http://62.234.49.52/api/models | head -c 100'));
