const {execSync} = require('child_process');
const key = 'C:\\Users\\duanmk\\.ssh\\id_ed25519';
const host = 'root@62.234.49.52';

function run(cmd, timeout=15000) {
  try {
    return execSync(`ssh -i "${key}" -o StrictHostKeyChecking=no ${host} "${cmd.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8', timeout, windowsHide: true
    });
  } catch(e) { return e.stdout || e.message || ''; }
}

// Check venv pip
console.log('=== venv pip ===');
console.log(run('ls /www/wwwroot/aura-app/aura-api/venv/bin/pip*'));

// Check system python3
console.log('=== python3 -m pip ===');
console.log(run('python3 -m pip --version'));

// Check PATH
console.log('=== PATH ===');
console.log(run('echo $PATH'));

// Find pip
console.log('=== find pip ===');
console.log(run('find /usr -name pip* 2>/dev/null | head -10'));
