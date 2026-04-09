const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';
function run(cmd, timeout) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout: timeout || 20000, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}
console.log('1. Check uploaded file');
console.log(run('ls -la /tmp/route.ts'));
console.log('2. Deploy: copy, build, restart');
console.log(run('mkdir -p /www/wwwroot/aura-app/src/app/api/enhance'));
console.log(run('cp /tmp/route.ts /www/wwwroot/aura-app/src/app/api/enhance/route.ts'));
console.log('3. Build');
console.log(run('cd /www/wwwroot/aura-app && npm run build'));
console.log('4. Restart');
console.log(run('pkill -f "python main.py" 2>/dev/null || true'));
console.log(run('pkill -f "next start" 2>/dev/null || true'));
console.log(run('cd /www/wwwroot/aura-app/aura-api && nohup ./venv/bin/python main.py > /www/wwwroot/aura-app/logs/backend.log 2>&1 &'));
console.log(run('sleep 2 && curl -s http://127.0.0.1:8000/models | head -c 50'));
console.log(run('cd /www/wwwroot/aura-app && nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &'));
console.log(run('sleep 4 && curl -s http://62.234.49.52/ | head -c 80'));
console.log('Done!');
