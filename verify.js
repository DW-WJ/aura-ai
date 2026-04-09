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

// Check backend routes and test
console.log('=== Backend direct test ===');
console.log(run('curl -s http://127.0.0.1:8000/models'));
console.log('=== Via Nginx /api/models ===');
console.log(run('curl -s http://62.234.49.52/api/models'));
console.log('=== Via Nginx /api/enhance ===');
console.log(run('curl -s -X POST http://62.234.49.52/api/enhance -H "Content-Type: application/json" -d \'{"answers":{},"base_config":"test","lang":"zh"}\' | head -c 200'));
console.log('=== Backend logs ===');
console.log(run('tail -20 /www/wwwroot/aura-app/aura-api/logs/stdout.log'));
