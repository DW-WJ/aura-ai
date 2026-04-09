const {spawn} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';
function run(cmd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn('ssh', ['-i', KEY, '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=30', HOST, cmd], {
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
  console.log('1. Kill port 3000');
  console.log(await run('fuser -k 3000/tcp 2>/dev/null; sleep 1; fuser 3000/tcp 2>/dev/null || echo "port 3000 free"'));
  console.log('2. Kill any next-server');
  console.log(await run('pkill -f "next-server" 2>/dev/null; sleep 1; echo killed'));
  console.log('3. Check .next date');
  console.log(await run('ls -la /www/wwwroot/aura-app/.next/BUILD_ID'));
  console.log('4. Start frontend');
  console.log(await run('cd /www/wwwroot/aura-app && nohup npm run start > /www/wwwroot/aura-app/logs/nextjs.log 2>&1 &'));
  console.log('5. Wait and check');
  console.log(await run('sleep 5 && curl -s http://127.0.0.1:3000/ | head -c 100'));
}
main().then(() => console.log('done'));
