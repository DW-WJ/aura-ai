const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const key = path.join(process.env.USERPROFILE, '.ssh', 'id_ed25519');
const host = 'root@62.234.49.52';
const appDir = '/www/wwwroot/aura-app';
const localRoute = 'G:/duanmk/claw_code/aura-app/src/app/api/enhance/route.ts';

console.log('=== Upload fixed route.ts ===');

// 1. 读取本地文件
const routeContent = fs.readFileSync(localRoute, 'utf8');
fs.writeFileSync('/tmp/route.ts', routeContent);
console.log('Local file written');

// 2. SCP 上传
const scpCmd = `scp -i "${key}" -o StrictHostKeyChecking=no /tmp/route.ts ${host}:/tmp/route.ts`;
execSync(scpCmd, { encoding: 'utf8', stdio: 'pipe' });
console.log('Uploaded to /tmp');

// 3. 服务器上复制并构建
const serverCmd = `
  cp /tmp/route.ts ${appDir}/src/app/api/enhance/route.ts
  cd ${appDir}
  pkill -f next-server 2>/dev/null || true
  pkill -f "python main.py" 2>/dev/null || true
  sleep 2
  cd ${appDir}/aura-api
  nohup ./venv/bin/python main.py > ${appDir}/logs/backend.log 2>&1 &
  sleep 2
  cd ${appDir}
  npm run build 2>&1 | tail -20
  sleep 2
  nohup npm run start > ${appDir}/logs/nextjs.log 2>&1 &
  sleep 3
  echo "=== Status ==="
  curl -s http://127.0.0.1:8000/models | head -c 100
  echo ""
  curl -s http://127.0.0.1:3000 | head -c 200
`;

execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${serverCmd}"`, { encoding: 'utf8', stdio: 'pipe' });

console.log('Done!');