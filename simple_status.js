const {spawn} = require('child_process');

const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';

function run(cmd) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', HOST, cmd], {
      windowsHide: true, timeout: 20000
    });
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.stderr.on('data', d => out += d);
    proc.on('close', code => resolve(out));
    proc.on('error', err => resolve('ERROR: ' + err.message));
    setTimeout(() => { proc.kill(); resolve('TIMEOUT'); }, 20000);
  });
}

async function main() {
  console.log('=== Checking server status ===');
  const r1 = await run('ps aux | grep node');
  console.log('Node procs:\n' + r1);
  const r2 = await run('curl -s http://62.234.49.52/');
  console.log('Website:\n' + (r2 || '(empty)'));
  const r3 = await run('curl -s http://127.0.0.1:8000/models');
  console.log('Backend:\n' + (r3 || '(empty)'));
  const r4 = await run('tail -5 /www/wwwroot/aura-app/logs/nextjs.log');
  console.log('Frontend log:\n' + r4);
}

main().then(() => console.log('done'));
