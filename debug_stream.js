const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', HOST, cmd], {
      windowsHide: true, timeout: timeout || 20000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 20000);
  });
}
async function main() {
  // 1. Check if services are running
  console.log('=== 1. Process check ===');
  console.log(await run('ps aux | grep -E "next-server|python.*main" | grep -v grep'));
  
  // 2. Test Nginx -> Python direct (should show SSE)
  console.log('=== 2. Direct /enhance-stream (via Nginx) ===');
  console.log(await run('timeout 8 curl -s -N -X POST http://62.234.49.52/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -8', 12000));
  
  // 3. Test Next.js -> /api/enhance-stream (SSE via Next.js)
  console.log('=== 3. Via Next.js /api/enhance-stream ===');
  console.log(await run('timeout 8 curl -s -N -X POST http://62.234.49.52/api/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -8', 12000));
  
  // 4. Test Next.js /api/enhance (non-streaming)
  console.log('=== 4. Via Next.js /api/enhance (JSON) ===');
  console.log(await run('curl -s -X POST http://62.234.49.52/api/enhance -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' | head -c 300'));
  
  // 5. Check frontend log
  console.log('=== 5. Frontend log (last 30 lines) ===');
  console.log(await run('tail -30 /www/wwwroot/aura-app/logs/nextjs.log'));
  
  // 6. Check BUILD_ID
  console.log('=== 6. BUILD_ID ===');
  console.log(await run('cat /www/wwwroot/aura-app/.next/BUILD_ID'));
  
  // 7. Check PYTHON_API_URL env on server
  console.log('=== 7. PYTHON_API_URL ===');
  console.log(await run('grep PYTHON_API /www/wwwroot/aura-app/.env'));
}
main().then(() => console.log('done'));
