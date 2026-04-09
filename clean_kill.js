const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', HOST, cmd], {
      windowsHide: true, timeout: timeout || 30000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 30000);
  });
}
async function main() {
  // Kill all node/next processes
  console.log(await run('pkill -9 -f "next-server" 2>/dev/null; pkill -9 -f "next start" 2>/dev/null; sleep 2; fuser 3000/tcp 2>/dev/null || echo "port 3000 free"'));
  
  // Verify BUILD_ID from today's build
  console.log(await run('cat /www/wwwroot/aura-app/.next/BUILD_ID'));
  
  // Start fresh
  console.log(await run('cd /www/wwwroot/aura-app && nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &'));
  console.log(await run('sleep 5 && curl -s http://127.0.0.1:3000/ | head -c 100'));
  
  // Check Nginx -> /enhance-stream
  console.log(await run('timeout 5 curl -s -N -X POST http://62.234.49.52/api/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -10', 10000));
}
main().then(() => console.log('done'));
