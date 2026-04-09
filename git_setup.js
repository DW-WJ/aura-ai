const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd, timeout=20000) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}

console.log('=== 1. Generate SSH key on server ===');
console.log(run('ls ~/.ssh/id_ed25519.pub 2>/dev/null && echo EXISTS || echo MISSING'));
console.log(run('ssh-keygen -t ed25519 -C "aura-server" -f ~/.ssh/id_ed25519 -N ""'));
console.log(run('cat ~/.ssh/id_ed25519.pub'));

console.log('=== 2. Check git remote ===');
console.log(run('cd /www/wwwroot/aura-app && git remote -v'));

console.log('=== 3. Switch to SSH URL ===');
console.log(run('cd /www/wwwroot/aura-app && git remote set-url origin git@github.com:DW-WJ/aura-ai.git'));
console.log(run('cd /www/wwwroot/aura-app && git remote -v'));
