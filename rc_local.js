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

console.log('=== 1. Setup rc.local ===');
const rcLocal = `#!/bin/bash
# AURA Auto Start
bash /tmp/aura-start.sh start
`;

run(`cat > /tmp/rc.local << 'RCEND'\n${rcLocal}\nRCEND`);
run('chmod +x /tmp/rc.local');
run('cat /tmp/rc.local');

console.log('=== 2. Find and update system rc.local ===');
// Find where rc.local is
console.log(run('ls -la /etc/rc.d/rc.local 2>/dev/null || ls -la /etc/rc.local 2>/dev/null'));
console.log(run('cat /etc/rc.d/rc.local 2>/dev/null || cat /etc/rc.local 2>/dev/null || echo "no rc.local found"'));

// Try different paths
const paths = ['/etc/rc.d/rc.local', '/etc/rc.local', '/rc.local'];
for (const p of paths) {
  const r = run(`ls ${p} 2>/dev/null && echo EXISTS || echo MISSING`);
  if (r.includes('EXISTS')) {
    console.log(`Found rc.local at: ${p}`);
    console.log(run(`cat ${p}`));
    break;
  }
}

console.log('=== 3. Try systemctl unmask ===');
run('systemctl unmask aura.service 2>/dev/null || true');
run('systemctl enable aura.service 2>/dev/null || true');

console.log('=== 4. Final status ===');
console.log(run('curl -s http://62.234.49.52/ | head -c 80'));
console.log(run('curl -s http://62.234.49.52/api/models | head -c 80'));
