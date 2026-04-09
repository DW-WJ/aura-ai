const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', HOST, cmd], {
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
  // Check route.ts source on server
  console.log(await run('head -60 /www/wwwroot/aura-app/src/app/api/enhance/route.ts'));
  // Check which build is running (BUILD_ID)
  console.log(await run('cat /www/wwwroot/aura-app/.next/BUILD_ID'));
  // Verify SSE stream from /api/enhance-stream
  console.log('=== SSE test ===');
  console.log(await run('timeout 8 curl -s -N -X POST http://62.234.49.52/api/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -12', 12000));
}
main().then(() => console.log('done'));
