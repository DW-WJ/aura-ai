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

// 1. Copy config to correct location
console.log('=== Copy to correct vhost dir ===');
console.log(run('cp /www/server/nginx/conf/vhost/aura.conf /www/server/panel/vhost/nginx/aura.conf'));

// 2. Remove old location to avoid confusion
console.log('=== Remove old location ===');
console.log(run('rm -f /www/server/nginx/conf/vhost/aura.conf'));

// 3. Test nginx
console.log('=== Test nginx ===');
console.log(run('nginx -t'));

// 4. Reload nginx
console.log('=== Reload nginx ===');
console.log(run('nginx -s reload'));

// 5. Wait and test
console.log('=== Test site ===');
console.log(run('curl -s http://62.234.49.52/ | head -c 200'));
