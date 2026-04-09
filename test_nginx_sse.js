const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=30', HOST, cmd], {
      windowsHide: true, timeout: timeout || 15000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 15000);
  });
}
async function main() {
  // Test Nginx -> Python SSE (direct, no Next.js)
  console.log('=== Test Nginx proxy SSE (via curl -N) ===');
  console.log(await run('timeout 5 curl -s -N -X POST http://62.234.49.52/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -15', 10000));
  // Also check what compiled route.js looks like
  console.log('=== Compiled route.js (first 60 lines) ===');
  console.log(await run('head -60 /www/wwwroot/aura-app/.next/server/app/api/enhance/route.js'));
}
main().then(() => console.log('done'));
