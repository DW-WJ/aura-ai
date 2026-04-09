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

console.log('=== 1. SCP upload new nginx config ===');
try {
  const r = execSync(`scp -i "${key}" -o StrictHostKeyChecking=no "G:\\duanmk\\claw_code\\aura-app\\aura-nginx.conf" root@62.234.49.52:/tmp/aura-nginx-new.conf`, {encoding: 'utf8', timeout: 30000});
  console.log(r);
} catch(e) { console.log(e.stdout || e.message || ''); }

console.log('=== 2. Copy to nginx vhost dir ===');
console.log(run('cp /tmp/aura-nginx-new.conf /www/server/panel/vhost/nginx/aura.conf'));

console.log('=== 3. Show new config ===');
console.log(run('cat /www/server/panel/vhost/nginx/aura.conf'));

console.log('=== 4. Test nginx ===');
console.log(run('nginx -t'));

console.log('=== 5. Reload nginx ===');
console.log(run('nginx -s reload'));

console.log('=== 6. Quick test via website ===');
console.log(run('curl -s http://62.234.49.52/ | head -c 80'));
console.log('Done!');
