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
  // Copy and replace update.sh
  console.log(await run('cp /tmp/update2.sh /www/wwwroot/aura-app/update.sh && chmod +x /www/wwwroot/aura-app/update.sh && echo "update.sh replaced"'));
  // Show the kill section to verify
  const idx = await run('grep -n "next-server" /www/wwwroot/aura-app/update.sh');
  console.log('next-server lines: ' + idx);
}
main().then(() => console.log('done'));
