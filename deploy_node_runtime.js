const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', HOST, cmd], {
      windowsHide: true, timeout: timeout || 300000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 300000);
  });
}
async function main() {
  console.log('1. Fix .env PYTHON_API_URL');
  console.log(await run("sed -i 's|PYTHON_API_URL=.*|PYTHON_API_URL=\"http://127.0.0.1:8000\"|' /www/wwwroot/aura-app/.env"));
  console.log(await run('grep PYTHON_API /www/wwwroot/aura-app/.env'));
  
  console.log('2. Copy new route.ts');
  console.log(await run('cp /tmp/route2.ts /www/wwwroot/aura-app/src/app/api/enhance/route.ts'));
  console.log(await run('grep -n "runtime" /www/wwwroot/aura-app/src/app/api/enhance/route.ts'));
  
  console.log('3. npm run build');
  const build = await run('cd /www/wwwroot/aura-app && npm run build 2>&1 | tail -20', 300000);
  console.log(build);
  
  console.log('4. Kill old services');
  console.log(await run('pkill -f "next-server" 2>/dev/null; pkill -f "python main.py" 2>/dev/null; sleep 2; echo killed'));
  
  console.log('5. Start backend');
  console.log(await run('cd /www/wwwroot/aura-app/aura-api && nohup ./venv/bin/python main.py > /www/wwwroot/aura-app/logs/backend.log 2>&1 &'));
  console.log(await run('sleep 3 && curl -s http://127.0.0.1:8000/models | head -c 60'));
  
  console.log('6. Start frontend');
  console.log(await run('cd /www/wwwroot/aura-app && nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &'));
  console.log(await run('sleep 5 && curl -s http://127.0.0.1:3000/ | head -c 60'));
  
  console.log('7. Test SSE via /api/enhance-stream');
  const sse = await run("timeout 8 curl -s -N -X POST http://62.234.49.52/api/enhance-stream -H 'Content-Type: application/json' -d '{\"answers\":{\"interaction\":\"proactive\"},\"base_config\":\"test\",\"lang\":\"zh\"}' 2>&1 | head -10", 15000);
  console.log(sse);
  
  console.log('8. BUILD_ID');
  console.log(await run('cat /www/wwwroot/aura-app/.next/BUILD_ID'));
}
main().then(() => console.log('ALL DONE'));
