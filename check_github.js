const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';
function run(cmd, timeout) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout: timeout || 20000, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}
console.log('=== Test GitHub SSH ===');
console.log(run('ssh -T git@github.com 2>&1'));
console.log('=== Test GitHub HTTPS ===');
console.log(run('curl -s --connect-timeout 5 https://github.com 2>&1 | head -c 100'));
console.log('=== Git status ===');
console.log(run('cd /www/wwwroot/aura-app && git status'));
