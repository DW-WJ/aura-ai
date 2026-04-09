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
  // Read compiled route.js from .next
  const r1 = await run('head -100 /www/wwwroot/aura-app/.next/server/app/api/enhance/route.js');
  console.log(r1);
}
main().then(() => console.log('done'));
