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

// Test direct backend streaming (should work)
console.log('=== Direct backend streaming (5s) ===');
console.log(run('timeout 5 curl -s -X POST http://127.0.0.1:8000/enhance -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' -N 2>&1 | head -10'));

// Check next.config to see if there's a streaming config
console.log('=== next.config.ts ===');
console.log(run('cat /www/wwwroot/aura-app/next.config.ts'));
