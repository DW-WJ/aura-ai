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

// 1. Check server .env PYTHON_API_URL
console.log('=== Server .env PYTHON_API_URL ===');
console.log(run('grep PYTHON_API /www/wwwroot/aura-app/.env'));

// 2. Test /enhance-stream directly on backend (should be SSE)
console.log('=== Backend /enhance-stream (SSE) direct ===');
console.log(run('timeout 5 curl -s -X POST http://127.0.0.1:8000/enhance-stream -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' -N 2>&1 | head -10'));

// 3. Test Next.js /api/enhance (via Nginx)
console.log('=== Next.js /api/enhance (via Nginx) ===');
console.log(run('timeout 5 curl -s -X POST http://62.234.49.52/api/enhance -H "Content-Type: application/json" -d \'{"answers":{"interaction":"proactive"},"base_config":"test","lang":"zh"}\' -N 2>&1 | head -10'));
