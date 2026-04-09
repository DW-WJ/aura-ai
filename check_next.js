const {execSync} = require('child_process');
const KEY = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const HOST = 'root@62.234.49.52';

function run(cmd, timeout) {
  try {
    return execSync('ssh -i "' + KEY + '" -o StrictHostKeyChecking=no ' + HOST, {
      encoding: 'utf8', timeout: timeout || 20000, windowsHide: true,
      input: cmd
    });
  } catch(e) { return (e.stdout || e.message || '').toString(); }
}

const out = run('find /www/wwwroot/aura-app/.next/server/app/api/enhance/ -type f 2>/dev/null');
console.log(out);
