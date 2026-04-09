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
  // Frontend accessible?
  const fe = await run('curl -s http://62.234.49.52/ | head -c 100');
  console.log('Frontend: ' + fe);
  
  // Next.js API: /api/enhance-stream (SSE)
  console.log('=== Next.js /api/enhance-stream (SSE) ===');
  const sse = await run('timeout 8 curl -s -N -X POST http://62.234.49.52/api/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' 2>&1 | head -15', 15000);
  console.log(sse);
  
  // Next.js API: /api/enhance (JSON fallback)
  console.log('=== Next.js /api/enhance (JSON) ===');
  const json = await run('curl -s -X POST http://62.234.49.52/api/enhance -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' | head -c 200');
  console.log(json);
}
main().then(() => console.log('done'));
