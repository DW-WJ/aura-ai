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

// Test streaming via Nginx - should show chunks arriving
console.log('=== Test SSE streaming (3 chunks) ===');
console.log(run('timeout 5 curl -s -X POST http://62.234.49.52/api/enhance -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' -N 2>&1 | head -20'));
