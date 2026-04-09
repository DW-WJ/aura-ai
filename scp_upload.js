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

console.log('=== 1. SCP upload nginx config ===');
try {
  const r = execSync(`scp -i "${key}" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\aura-nginx.conf" root@62.234.49.52:/tmp/aura-nginx.conf`, {encoding: 'utf8', timeout: 30000});
  console.log(r);
} catch(e) { console.log(e.stdout || e.message || ''); }

console.log('=== 2. Copy to correct location ===');
console.log(run('cp /tmp/aura-nginx.conf /www/server/panel/vhost/nginx/aura.conf'));
console.log(run('cat /www/server/panel/vhost/nginx/aura.conf'));

console.log('=== 3. Test nginx ===');
console.log(run('nginx -t'));
console.log(run('nginx -s reload'));

console.log('=== 4. Verify ===');
console.log('前端: ' + run('curl -s http://62.234.49.52/ | head -c 100'));
console.log('API: ' + run('curl -s http://62.234.49.52/api/models | head -c 100'));
console.log('后端: ' + run('curl -s http://127.0.0.1:8000/models | head -c 100'));
