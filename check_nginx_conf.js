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
    proc.stderr.on('data', d => {});
    proc.on('close', () => resolve(out));
    proc.on('error', err => resolve('ERR: ' + err.message));
    setTimeout(() => { try { proc.kill(); } catch(e) {} resolve('TIMEOUT'); }, timeout || 15000);
  });
}

async function main() {
  // Check Nginx config for /api/ location
  const cfg = await run('grep -A 20 "location /api/" /www/server/nginx/conf/nginx.conf /www/server/panel/vhost/nginx/*.conf 2>/dev/null | head -80');
  console.log('=== Nginx /api/ config ===');
  console.log(cfg);

  // Check the auraapi.conf
  const aura = await run('cat /www/server/panel/vhost/nginx/auraapi.conf 2>/dev/null');
  console.log('=== auraapi.conf ===');
  console.log(aura);

  // Check the main aura.conf
  const auraMain = await run('cat /www/server/panel/vhost/nginx/aura.conf 2>/dev/null');
  console.log('=== aura.conf ===');
  console.log(auraMain);
}

main().then(() => console.log('done'));
